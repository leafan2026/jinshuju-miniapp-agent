import { defineTool } from "eve/tools";
import { z } from "zod";

type DeploymentMode = "manual" | "pipeline";

/** POSIX shell 单引号转义:把值安全地包成一个 shell 参数。 */
function sq(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

/**
 * 明确声明当前分支的唯一发布触发器。缺失或错误配置一律拒绝，不能悄悄
 * 回退为 CLI 部署，否则流水线已监听时会为同一提交创建第二个云托管版本。
 */
function deploymentMode(): DeploymentMode | undefined {
  const mode = process.env.WXCLOUD_DEPLOY_MODE?.trim().toLowerCase();
  return mode === "manual" || mode === "pipeline" ? mode : undefined;
}

function manualDeploymentRequiredMessage(): string {
  return (
    "deploy_cloudrun 只允许 WXCLOUD_DEPLOY_MODE=manual。当前项目应为每个分支只保留一种发布触发器：" +
    "已配置云托管工作流时请设为 pipeline 并等待/验证流水线，不要再发起 CLI 部署。"
  );
}

/**
 * 用微信云托管 CLI(@wxcloud/cli)把当前项目部署到云托管。
 *
 * 对外副作用；只有 manual 模式会要求每次人工确认。
 *
 * 依赖环境变量(见 .env.example):
 *  - WXCLOUD_ENV_ID    云托管环境 id
 *  - WX_PROJECT_PATH   项目路径(默认 "."）
 *
 * 说明:@wxcloud/cli 的确切子命令 / flag / 登录方式以其当前版本为准
 * (https://cloud.weixin.qq.com/cli/guide)。首次使用需在执行环境内完成登录
 * (`wxcloud login`)或配置 CI 凭证,本工具的参数可能需要按实际 CLI 调整。
 * 若使用 GitHub 仓库绑定的云托管工作流，必须设置 WXCLOUD_DEPLOY_MODE=pipeline；
 * 此工具会在审批前拒绝执行，避免流水线和 CLI 为同一提交各创建一个版本。
 */
export default defineTool({
  description:
    "仅在 WXCLOUD_DEPLOY_MODE=manual 时用微信云托管 CLI(@wxcloud/cli)部署一次。若项目由云托管工作流自动部署，必须设为 pipeline，本工具会拒绝执行以避免重复版本。对外副作用，需人工审批。",
  inputSchema: z.object({
    remark: z.string().optional().describe("部署备注(可选)"),
  }),
  approval: () =>
    deploymentMode() === "manual"
      ? "user-approval"
      : { type: "denied", reason: manualDeploymentRequiredMessage() },
  async execute({ remark }, ctx) {
    if (deploymentMode() !== "manual") {
      throw new Error(manualDeploymentRequiredMessage());
    }

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
      note:
        "已通过 manual 模式发起一次 CLI 部署。请只验证本次新建版本的状态和流量，不要为确认结果再次调用 CLI。",
    };
  },
});
