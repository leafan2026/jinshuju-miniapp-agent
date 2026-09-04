---
name: jinshuju-miniapp
description: 规划、搭建或迭代以金数据 Tables 为数据核心的微信小程序；涵盖前端交互样机、金数据 MCP 表结构、数据映射与安全发布。
metadata:
  short-description: 搭建金数据 Tables 驱动的微信小程序
---

# 金数据小程序搭建

用于把业务需求落实为「微信小程序 + 金数据 Tables」：先确认体验和字段，再创建或核对表结构，最后实施与发布。不要把本 Skill 绑定到 Eve、Vercel 或任何特定 Agent 运行时。

## 工作边界

- 金数据 Tables 是业务数据核心。小程序不应保存或直接暴露 Access Token；由可信服务端以 `Authorization: Bearer <access_token>` 调用金数据 API。
- Access Token 只从受控配置读取，不写入源码、样机、对话、命令行参数或日志。提醒用户创建时立即保存，并将服务端出口 IP 加入金数据白名单。
- 当前会话若有金数据 MCP，先搜索其当前能力与参数 schema，再调用动态发现的工具。不能假设工具名、字段 key 或 API 返回格式。
- 当前会话没有可用的金数据 MCP 或授权时，如实说明无法直接执行；不要把普通建表请求改写成启动 `npm run dev`、选择模型、安装 Vercel CLI 或登录 Vercel 的步骤。只有用户明确要求排查某个本地运行环境时，才讨论该环境。
- 创建、修改或删除 Table、字段、条目之前，先展示变更范围并取得确认；完成后用当前 MCP 的只读能力核验结果，核验前不得声称已创建。
- 引用本仓库的样机或规格前，先核实文件存在；不得编造本地路径或成品文件名。

## 推荐流程

1. 明确用户、业务目标、主要页面和数据实体；按需阅读 [需求与凭证准备](references/collect-requirements.md)。
2. 尚无原型时，阅读 [前端样机方法](references/frontend-demo.md)；设计方向和可打开的参考分别在 [design-directions.md](references/design-directions.md) 与 [style-gallery.html](references/style-gallery.html)。
3. 规划或操作金数据 Tables 时，阅读 [表结构与 MCP 操作](references/jinshuju-schema.md)，并按字段映射模板工作。
4. 实施小程序与服务端，并在发布前阅读 [部署约束](references/deployment.md) 和 [交付不变量](references/delivery-invariants.md)。

## 已附样机

[个人工作台样机](assets/personal-workbench-demo/personal-workbench.html) 是离线、内存假数据的可交互 HTML 原型，覆盖工作项目/任务、个人计划和随笔。使用或改造前阅读同目录的 `README.md` 与 `personal-workbench-spec.md`；它不含真实凭证，也不连接金数据。
