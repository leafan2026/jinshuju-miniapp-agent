# 金数据小程序设计方向库

这些方向从 [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) 收录的公开设计分析中提炼而来。它们是**风格参考**，不是品牌模板：实施时只复用通用的色彩层级、信息密度、留白、圆角和组件组织方式；不得复制来源品牌的商标、图像、插画、字体文件、文案或产品截图。

先打开同目录的 `style-gallery.html` 与客户确认方向，再制作单一业务的移动端 demo。

| # | 参考方向 | 最适合的金数据场景 | 可提炼的视觉语言 | 不应照搬 |
| --- | --- | --- | --- | --- |
| 01 | [Notion](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/notion) | 个人工作台 | 深色欢迎区、淡色信息卡、清晰的任务优先级 | 紫色品牌、插画、原产品界面 |
| 02 | [Linear](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/linear.app) | 个人工作台 / 待办 | 近黑界面、单一冷色强调、紧凑任务列表 | 品牌标识、原任务管理交互 |
| 03 | [Airtable](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/airtable) | CRM / 表格管理 | 白底结构化表格、少量强色状态、利落边线 | 表格产品的命名与图形资产 |
| 04 | [Intercom](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/intercom) | 客户查询 / 发货售后 | 柔和米色、会话式信息流、橙色仅用于关键动作 | 客服品牌及消息样式细节 |
| 05 | [Cal.com](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/cal) | 赛事报名 + 查询 | 清爽日程、留白、黑色主按钮与彩色状态点 | 日历产品名称与具体控件 |
| 06 | [Miro](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/miro) | 赛事运营 / 志愿者协同 | 黄色导航提示、便签式分组、可视化进度 | 白板图形、品牌色组合 |
| 07 | [PostHog](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/posthog) | 数据仪表盘（友好版） | 暖灰底、轻量边框、数据卡搭配柔和强调色 | 吉祥物与任何插画资产 |
| 08 | [Sentry](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/sentry) | 数据仪表盘（预警版） | 深紫底、高对比数字、荧光色仅作风险提示 | 品牌角色、显示字体与商标 |
| 09 | [Stripe](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/stripe) | 经营数据 / 高管看板 | 靛蓝渐变、精确数字、轻量数据卡 | 金融产品文案和图案 |
| 10 | [Shopify](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/shopify) | CRM / 销售管理 | 黑白主骨架、薄荷绿交易态、强行动按钮 | 商家照片、品牌字样与电商内容 |

## 场景推荐

- **个人工作台**：01 轻量温暖；02 专注高效。
- **客户查询系统（发货、售后等）**：04 服务感强；10 交易/状态感强。
- **赛事报名 + 查询**：05 适合报名与日程；06 适合赛事运营和进度管理。
- **数据仪表盘**：07 适合日常业务复盘；08 适合异常监控；09 适合经营汇总。
- **CRM 管理系统**：03 适合结构化客户表；10 适合销售漏斗与订单状态。

## 使用约束

1. 先从金数据 MCP 读取实际表单、字段和选项，再填写 demo 的假数据；不要根据视觉参考虚构字段。
2. 每个正式 demo 只选一个主方向；避免把多个来源的标志性色彩和组件随意拼接。
3. 小程序优先保证 44px 以上触控区域、状态色可读性和低网速下的骨架/空状态。
4. 客户数据、手机号、订单号等使用脱敏假数据；不得将 Access Token 或原始表单数据写入 demo。
