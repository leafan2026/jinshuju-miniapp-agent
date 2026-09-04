---
description: 小程序代码需要构建上传(miniprogram-ci)或部署到微信云托管(云函数用 Access Token 取金数据数据)时使用,含 GitHub 托管与手动两条部署路径。
---

# 阶段二③:开发与部署

目标:把确认好的前端 + 金数据表结构落地成小程序代码与云函数,上传小程序、部署云托管。

## A. 云函数取数(架构核心)
- 小程序**不直接持有**金数据 Access Token;由**微信云托管的服务 / 云函数**用 Token 去 GET 金数据 tables,再返回给小程序。
- 云函数用 `Authorization: Bearer <JINSHUJU_ACCESS_TOKEN>` 调金数据 API。Token 只从部署环境变量读取，不进入小程序包、源代码、终端输出或运行日志。
- 前置:云函数出口 IP 已在金数据白名单(见 `collect-requirements`);微信云托管控制台的「云调用 / 外部 API」按需配置。
- 按 `jinshuju-schema` 的字段映射,把金数据字段转成前端 demo 用的结构后再返回,避免把原始字段 key 泄露到前端。

## B. 上传小程序代码(miniprogram-ci)
用 `upload_miniprogram` 工具(需审批),它封装 miniprogram-ci:
- 参数:`version`、`desc`(改动说明)、`robot`(1–30,CI 机器人编号)。
- 依赖环境变量:`WX_APPID`、`WX_UPLOAD_PRIVATE_KEY_PATH`、`WX_PROJECT_PATH`。
- 等价命令(供理解参考):
  `miniprogram-ci upload --pp <projectPath> --pkp <privateKeyPath> --appid <appid> --uv <version> -r 1 --enable-es6 true`
- 上传前确认 miniprogram-ci 运行环境 IP 已加入小程序「代码上传」IP 白名单。

## C. 部署云托管
严格按 `WXCLOUD_DEPLOY_MODE` 执行。**同一个服务/分支只能有一个发布触发器**，不能把下列路径叠加使用。

1. **`pipeline`(GitHub/云托管工作流)**
   - 仓库推送是唯一部署触发器。禁止调用 `deploy_cloudrun`、`wxcloud deploy`，也不要在控制台手动触发一次“验证”。
   - 推送前记录该服务已有版本的集合；推送后仅把新出现的版本作为候选。不可根据提交标题、备注或时间猜测候选版本。
   - 核对候选版本已稳定且承接预期流量；无法取得精确候选或状态时，报告为“等待流水线验证”，不要改走 CLI。

2. **`manual`(CLI 手动部署)**
   - 前提是没有云托管工作流监听当前分支。`deploy_cloudrun` 只在此模式下可用，并且每次调用都需要审批。
   - 调用一次后，只验证本次创建的版本状态与流量；失败或信息不足时如实停止，不能以重复调用 CLI 作为重试或验证手段。

切换模式不是一次临时操作：先启用/关闭对应工作流，再同步 `WXCLOUD_DEPLOY_MODE`、工作流仓库/分支和本 skill；否则保持停止状态。

## 收尾
- 部署后核对:精确目标版本已稳定并承接预期流量、云函数能取到金数据数据、小程序体验版能正常展示。
- 提醒客户妥善保管白名单、上传密钥、Access Token;后续换客户换一套环境变量配置即可。
