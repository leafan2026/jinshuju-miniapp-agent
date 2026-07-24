import { defineSandbox } from "eve/sandbox";

/**
 * agent 的隔离执行环境。用来在里面跑小程序 / 云托管的命令行工具:
 *  - @wxcloud/cli    → 全局安装,供 `deploy_cloudrun` 调用 `wxcloud` 命令。
 *  - miniprogram-ci  → 装到 /workspace 本地依赖,供 `upload_miniprogram` 用 Node API 调用。
 *
 * bootstrap 只在模板构建时跑一次;改动本文件会触发 eve 重建模板并重新安装。
 * 未指定 backend,使用 defaultBackend()(Vercel 上用 Vercel Sandbox,本地用 Docker/microsandbox/just-bash)。
 */
export default defineSandbox({
  async bootstrap({ use }) {
    const sandbox = await use();
    // 云托管 CLI 作为全局命令。
    await sandbox.run({ command: "npm install -g @wxcloud/cli" });
    // miniprogram-ci 作为本地依赖,便于 `node` 脚本 require 调用其 Node API。
    await sandbox.run({ command: "npm install miniprogram-ci" });
  },
});
