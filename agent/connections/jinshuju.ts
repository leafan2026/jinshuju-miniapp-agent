import { defineMcpClientConnection } from "eve/connections";

/**
 * 金数据(Jinshuju)MCP 连接。
 *
 * 端点与认证方式来自官方文档:https://open.jinshuju.net/mcp/
 *  - Server URL: https://jinshuju.net/mcp(Streamable HTTP)
 *  - 认证:企业版 API Key,以 HTTP Basic 方式传递
 *    Authorization: Basic base64("<api_key>:<api_secret>")
 *
 * 金数据用的是 Basic 而不是 Bearer,所以这里用 `headers` 直接设置 Authorization,
 * 而不是 eve 的 `auth.getToken`(后者会强制发 `Bearer <token>`,会被金数据拒绝)。
 *
 * 凭证 = 当前客户项目的金数据账号,从环境变量读取(见 .env.example)。
 * 本 agent 一次服务一个客户项目,换客户时换这套环境变量即可,无需在会话里区分多租户。
 * (若确实需要「每个终端用户各自授权」,可改用 OAuth:https://open.jinshuju.net/mcp/oauth/)
 */

// 需要人工确认的工具:会新增 / 修改 / 删除数据或表单结构。
// 只读工具(get_* / list_* / check_field_data)不在此列,直接放行。
const WRITE_TOOLS = new Set<string>([
  // 数据条目
  "create_entry",
  "create_entries",
  "update_entry",
  "patch_entries",
  "delete_entry",
  // 表单及其变体
  "create_form",
  "edit_form",
  "copy_form",
  "move_form",
  "create_evaluation_form",
  "edit_evaluation_form",
  "create_exam_form",
  "edit_exam_form",
  // 字段规则与主题
  "edit_field_rules",
  "edit_theme",
  // 数据视图
  "create_form_view",
  "edit_form_view",
  "delete_form_view",
  // 结构:文件夹 / 数据表
  "create_folder",
  "create_table",
  "edit_table",
]);

/** 从环境变量读取金数据凭证,拼成 HTTP Basic 认证头。 */
function basicAuthHeader(): Record<string, string> {
  const apiKey = process.env.JINSHUJU_API_KEY;
  const apiSecret = process.env.JINSHUJU_API_SECRET;
  if (!apiKey || !apiSecret) {
    throw new Error(
      "缺少金数据 API 凭证:请设置环境变量 JINSHUJU_API_KEY 和 JINSHUJU_API_SECRET" +
        "(企业版在 金数据开放平台 > API Key 生成)。参见 .env.example。",
    );
  }
  const encoded = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  return { Authorization: `Basic ${encoded}` };
}

export default defineMcpClientConnection({
  url: "https://jinshuju.net/mcp",
  description:
    "金数据(Jinshuju)表单平台:查询与管理表单、数据条目(entries)、数据视图、字段规则,以及账户与成员信息。" +
    "用它来读取表单结构、检索或统计填写数据,或在用户确认后新增、修改、删除条目和表单。",
  // 金数据使用 Basic 认证,必须走 headers(用 auth.getToken 会发成 Bearer,被服务端拒绝)。
  headers: () => basicAuthHeader(),
  // 只读工具直接执行;任何会改动数据或结构的工具都先暂停,等待用户确认。
  approval: ({ toolName }) => {
    // 连接工具的名字是限定名,形如 "jinshuju__delete_entry",取最后一段做原始工具名。
    const bareName = toolName.split("__").pop() ?? toolName;
    return WRITE_TOOLS.has(bareName) ? "user-approval" : "not-applicable";
  },
});
