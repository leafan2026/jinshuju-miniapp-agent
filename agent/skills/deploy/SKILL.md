---
description: 小程序代码需要构建上传(miniprogram-ci)或部署到微信云托管(云函数用企业版 Key 取金数据数据)时使用,含 GitHub 托管与手动两条部署路径。
---

# 阶段二③:开发与部署

目标:把确认好的前端 + 金数据表结构落地成小程序代码与云函数,上传小程序、部署云托管。

## A. 云函数取数(架构核心)
- 小程序**不直接持有**金数据企业版 Key;由**微信云托管的服务 / 云函数**用 Key 去 GET 金数据 tables,再返回给小程序。
- 云函数用 `Authorization: Basic base64(JINSHUJU_API_KEY:JINSHUJU_API_SECRET)` 调金数据 API。
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
按 `collect-requirements` 里选定的方式,两条路径:
1. **GitHub 托管(推荐)**:代码推到 GitHub,在微信云托管控制台绑定该仓库,配置推送自动部署。适合长期维护。
2. **手动部署**:
   - 用 `deploy_cloudrun` 工具(需审批),封装 `@wxcloud/cli` 的 `wxcloud deploy`,依赖 `WXCLOUD_ENV_ID` 等。
   - 或不使用 CLI:在微信云托管控制台手动上传代码包 / 触发构建。

## 收尾
- 部署后核对:云函数能取到金数据数据、小程序体验版能正常展示。
- 提醒客户妥善保管白名单、上传密钥、Key/Secret;后续换客户换一套环境变量配置即可。
