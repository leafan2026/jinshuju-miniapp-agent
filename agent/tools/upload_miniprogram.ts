import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

/**
 * 用 miniprogram-ci 上传当前项目的小程序代码(生成体验版)。
 *
 * 这是对微信平台的对外副作用,`approval: always()` 要求每次人工确认。
 * 通过 miniprogram-ci 的 Node API 调用(参数用 JSON.stringify 嵌入脚本,杜绝命令行注入)。
 *
 * 依赖环境变量(见 .env.example):
 *  - WX_APPID                  小程序 appid
 *  - WX_UPLOAD_PRIVATE_KEY_PATH 代码上传密钥私钥文件路径(需把运行环境 IP 加入其白名单)
 *  - WX_PROJECT_PATH           小程序项目路径(默认 "."）
 */
export default defineTool({
  description:
    "用 miniprogram-ci 上传当前项目的小程序代码到微信平台(生成体验版)。对外副作用,需人工审批。前置:已配置 WX_APPID、上传密钥,且运行环境 IP 已加入小程序代码上传 IP 白名单。",
  inputSchema: z.object({
    version: z
      .string()
      .regex(/^[0-9A-Za-z.\-_]+$/, "版本号只能含数字、字母、点、短横线、下划线")
      .describe("版本号,如 1.0.0"),
    desc: z.string().min(1).describe("本次上传的改动说明"),
    robot: z.number().int().min(1).max(30).default(1).describe("CI 机器人编号(1-30)"),
  }),
  approval: always(),
  async execute({ version, desc, robot }, ctx) {
    const appid = process.env.WX_APPID;
    const privateKeyPath = process.env.WX_UPLOAD_PRIVATE_KEY_PATH;
    const projectPath = process.env.WX_PROJECT_PATH ?? ".";
    if (!appid || !privateKeyPath) {
      throw new Error(
        "缺少环境变量 WX_APPID / WX_UPLOAD_PRIVATE_KEY_PATH(见 .env.example)。",
      );
    }

    // 用 miniprogram-ci 的 Node API 组装脚本;所有外部值经 JSON.stringify 转为安全的 JS 字面量。
    const script = `
const ci = require('miniprogram-ci');
(async () => {
  const project = new ci.Project({
    appid: ${JSON.stringify(appid)},
    type: 'miniProgram',
    projectPath: ${JSON.stringify(projectPath)},
    privateKeyPath: ${JSON.stringify(privateKeyPath)},
    ignores: ['node_modules/**/*'],
  });
  const result = await ci.upload({
    project,
    version: ${JSON.stringify(version)},
    desc: ${JSON.stringify(desc)},
    setting: { es6: true },
    robot: ${robot},
  });
  console.log(JSON.stringify(result));
})().catch((err) => { console.error(String(err && err.message || err)); process.exit(1); });
`;

    const sandbox = await ctx.getSandbox();
    await sandbox.writeTextFile({ path: "mpci-upload.cjs", content: script });
    const result = await sandbox.run({ command: "node mpci-upload.cjs" });
    return { stdout: result.stdout, stderr: result.stderr };
  },
});
