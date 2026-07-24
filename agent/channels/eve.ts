import { eveChannel } from "eve/channels/eve";
import { localDev, vercelOidc } from "eve/channels/auth";

/**
 * 本 agent 主要是开发者自用的搭建工具:
 *  - localDev():本地 `eve dev` / REPL 访问。
 *  - vercelOidc():部署到 Vercel 后,供 TUI 与团队内部 / 子 agent 调用。
 *
 * 已移除脚手架里的 placeholderAuth()(它在生产只会返回 401 占位)。
 * eve 默认 fail-closed:生产环境不会放行匿名浏览器流量。
 * 若日后要对外公开访问,再在此加入共享密钥 / 应用鉴权
 * (见 eve 文档 Auth & route protection:httpBasic()、jwtHmac()、自定义 AuthFn 等)。
 */
export default eveChannel({
  auth: [vercelOidc(), localDev()],
});
