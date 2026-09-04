---
description: 启动一个新的小程序搭建项目,或需要盘点、收集客户要准备的接入信息(小程序 appid、金数据 Access Token、出口 IP 白名单、代码上传密钥、企业微信客服、代码托管与部署方式)时使用。
---

# 阶段一:信息收集

目标:带客户逐项备齐搭建「小程序 + 金数据」应用所需的接入信息与凭证。**一次只问一到两项**,拿到再问下一项,并把已收集的项复述确认。

## 清单(按顺序推进)

### 1. 小程序 appid + 金数据 Access Token
- 微信小程序 appid:微信公众平台 > 开发管理 > 开发设置 获取。
- 金数据 Access Token:在金数据系统后台创建。完整 Token 只在创建时显示一次，要求客户立即复制到受控的密码库或密钥管理服务。
- 拿到后填入项目环境变量 `JINSHUJU_ACCESS_TOKEN`(见 `.env.example`)，不要贴进聊天或代码，也不要自行拼接 `Bearer ` 前缀。

### 2. 出口 IP 白名单
- 云函数用 Access Token 请求金数据时,金数据侧会校验来源 IP。
- 用 `get_egress_ip` 工具查询当前出口 IP,提醒客户到「金数据开放平台 > 白名单设置」把该 IP 加入白名单。
- 提醒:云托管出口 IP 可能变化,建议配置固定公网出口(固定 IP / NAT 网关),否则白名单会失效。

### 3. 小程序代码上传密钥
- 微信公众平台 > 开发管理 > 开发设置 > 小程序代码上传 生成上传密钥,并**把 miniprogram-ci 运行环境的 IP 加入其 IP 白名单**。
- 把私钥文件路径填入 `WX_UPLOAD_PRIVATE_KEY_PATH`。用于 `upload_miniprogram`。

### 4.(可选)企业微信客服
- 若要接入企业微信客服:收集企业 id(corpId)与客服接入 url,填入 `WXWORK_CORP_ID` / `WXWORK_KF_URL`。
- 不启用可跳过。

### 5. 代码托管 / 部署方式
- 先确认**唯一的云托管发布触发器**，并填入 `WXCLOUD_DEPLOY_MODE`；没有明确选择不能进入部署阶段。
  - 已配置 GitHub 仓库/分支触发的云托管工作流:设为 `pipeline`。推送是唯一的部署动作；禁止 agent 再调用 `deploy_cloudrun`、在控制台手动构建，或用额外 CLI 部署“确认”工作流。
  - 未配置该分支自动工作流，且明确授权手动发布:设为 `manual`。先确认没有其他工作流监听该分支，才允许用 `deploy_cloudrun` 发起一次部署。
- 记录工作流监听的仓库、分支和服务(若为 `pipeline`)，或记录手动部署目标(若为 `manual`)，再确认云托管环境 id，填入 `WXCLOUD_ENV_ID`。

## 完成标志
appid、金数据 Access Token 已配置;出口 IP 已提交白名单;上传密钥就绪;部署模式、工作流监听范围(若有)与环境 id 已确认。齐了就进入阶段二(`frontend-demo` / `jinshuju-schema` / `deploy`)。
