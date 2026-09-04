import { defineMcpClientConnection } from "eve/connections";

/**
 * 金数据(Jinshuju)MCP 连接。
 *
 * 端点与认证方式来自官方文档:
 * https://open.jinshuju.net/api_v1/authentication
 *  - Server URL: https://jinshuju.net/mcp(Streamable HTTP)
 *  - 认证:金数据后台创建的 Access Token
 *    Authorization: Bearer <access_token>
 *
 * 使用 eve 的 `auth.getToken`，由框架在每次连接请求时安全地添加 Bearer 头；Token
 * 不会进入模型上下文或会话记录。
 *
 * 凭证 = 当前客户项目的金数据账号,从环境变量读取(见 .env.example)。
 * 本 agent 一次服务一个客户项目,换客户时换这套环境变量即可,无需在会话里区分多租户。
 */

/**
 * MCP 服务端在连接时公布工具及 schema，不能把可写工具名固定在客户端。
 * 仅放行语义明确的只读工具；所有新增、未知或可能产生副作用的能力都要求审批。
 */
function isClearlyReadOnlyTool(toolName: string): boolean {
  return /^(get|list|search|find|count|check|inspect)_/.test(toolName);
}

/** 从环境变量读取一次性展示的 Access Token。 */
function accessToken(): string {
  const token = process.env.JINSHUJU_ACCESS_TOKEN?.trim();
  if (!token) {
    throw new Error(
      "缺少金数据 Access Token:请设置环境变量 JINSHUJU_ACCESS_TOKEN" +
        "(在金数据系统后台创建后立即复制保存)。参见 .env.example。",
    );
  }
  return token;
}

export default defineMcpClientConnection({
  url: "https://jinshuju.net/mcp",
  description:
    "金数据(Jinshuju)表单平台:查询与管理表单、数据条目(entries)、数据视图、字段规则,以及账户与成员信息。" +
    "工具名称、描述和输入 schema 由 MCP 服务端在连接时动态发现；先搜索当前能力，再按返回的 schema 调用。",
  auth: {
    // eve 负责添加 `Authorization: Bearer <token>`，避免在工具参数或对话中暴露凭证。
    getToken: async () => ({ token: accessToken() }),
  },
  // 已知只读能力直接执行；所有写入、未知或未来新增能力均先暂停等待用户确认。
  approval: ({ toolName }) => {
    // 连接工具的名字是限定名,形如 "jinshuju__delete_entry",取最后一段做原始工具名。
    const bareName = toolName.split("__").pop() ?? toolName;
    return isClearlyReadOnlyTool(bareName) ? "not-applicable" : "user-approval";
  },
});
