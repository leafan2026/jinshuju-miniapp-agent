import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

/** POSIX shell 单引号转义:把值安全地包成一个 shell 参数。 */
function sq(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

/**
 * 用微信云托管 CLI(@wxcloud/cli)把当前项目部署到云托管。
 *
 * 对外副作用,`approval: always()` 要求每次人工确认。
 *
 * 依赖环境变量(见 .env.example):
 *  - WXCLOUD_ENV_ID    云托管环境 id
 *  - WX_PROJECT_PATH   项目路径(默认 "."）
 *
 * 说明:@wxcloud/cli 的确切子命令 / flag / 登录方式以其当前版本为准
 * (https://cloud.weixin.qq.com/cli/guide)。首次使用需在执行环境内完成登录
 * (`wxcloud login`)或配置 CI 凭证,本工具的参数可能需要按实际 CLI 调整。
 * 若不想用 CLI,也可走「GitHub 仓库绑定云托管自动部署」或控制台手动部署(见 deploy skill)。
 */
export default defineTool({
  description:
    "用微信云托管 CLI(@wxcloud/cli)把当前项目部署到云托管。对外副作用,需人工审批。前置:已配置 WXCLOUD_ENV_ID,且执行环境已完成 wxcloud 登录 / CI 凭证。参数以实际 CLI 版本为准。",
  inputSchema: z.object({
    remark: z.string().optional().describe("部署备注(可选)"),
  }),
  approval: always(),
  async execute({ remark }, ctx) {
    const envId = process.env.WXCLOUD_ENV_ID;
    const projectPath = process.env.WX_PROJECT_PATH ?? ".";
    if (!envId) {
      throw new Error("缺少环境变量 WXCLOUD_ENV_ID(见 .env.example)。");
    }

    const parts = ["wxcloud", "deploy", "--envId", sq(envId)];
    if (remark) parts.push("--remark", sq(remark));

    const sandbox = await ctx.getSandbox();
    const result = await sandbox.run({
      command: `cd ${sq(projectPath)} && ${parts.join(" ")}`,
    });
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      note: "wxcloud CLI 的参数与登录方式以实际版本为准,首次部署请核对。",
    };
  },
});
