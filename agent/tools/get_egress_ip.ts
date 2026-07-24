import { defineTool } from "eve/tools";
import { z } from "zod";

/**
 * 查询当前执行环境的公网出口 IP,用于提醒用户把它加入金数据 API 白名单。
 * 只读、无副作用,不需要审批。
 */
export default defineTool({
  description:
    "查询当前(sandbox / 部署)执行环境的公网出口 IP,用于把它加入金数据 API 白名单。只读,无副作用。注意:云托管的实际出口 IP 可能与此不同,以云托管环境的固定出口为准。",
  inputSchema: z.object({}),
  async execute(_input, ctx) {
    const sandbox = await ctx.getSandbox();
    const result = await sandbox.run({
      command: "curl -s https://api.ipify.org || curl -s https://ifconfig.me",
    });
    const ip = result.stdout.trim();
    if (!ip) {
      return { ip: null, note: "未能获取到出口 IP,请检查执行环境的网络出口设置。" };
    }
    return { ip };
  },
});
