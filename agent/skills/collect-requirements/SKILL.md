---
description: 启动一个新的小程序搭建项目,或需要盘点、收集客户要准备的接入信息(小程序 appid、金数据企业版 Key/Secret、出口 IP 白名单、代码上传密钥、企业微信客服、代码托管与部署方式)时使用。
---

# 阶段一:信息收集

目标:带客户逐项备齐搭建「小程序 + 金数据」应用所需的接入信息与凭证。**一次只问一到两项**,拿到再问下一项,并把已收集的项复述确认。

## 清单(按顺序推进)

### 1. 小程序 appid + 金数据企业版 API Key/Secret
- 微信小程序 appid:微信公众平台 > 开发管理 > 开发设置 获取。
- 金数据 API Key / Secret:金数据开放平台 > API Key 生成(**需企业版套餐**;免费版可改用 OAuth,但云函数服务端取数推荐企业版 Key)。
- 拿到后填入项目环境变量 `JINSHUJU_API_KEY` / `JINSHUJU_API_SECRET`(见 `.env.example`),不要贴进聊天或代码。

### 2. 出口 IP 白名单
- 云函数用企业版 Key 请求金数据时,金数据侧会校验来源 IP。
- 用 `get_egress_ip` 工具查询当前出口 IP,提醒客户到「金数据开放平台 > 白名单设置」把该 IP 加入白名单。
- 提醒:云托管出口 IP 可能变化,建议配置固定公网出口(固定 IP / NAT 网关),否则白名单会失效。

### 3. 小程序代码上传密钥
- 微信公众平台 > 开发管理 > 开发设置 > 小程序代码上传 生成上传密钥,并**把 miniprogram-ci 运行环境的 IP 加入其 IP 白名单**。
- 把私钥文件路径填入 `WX_UPLOAD_PRIVATE_KEY_PATH`。用于 `upload_miniprogram`。

### 4.(可选)企业微信客服
- 若要接入企业微信客服:收集企业 id(corpId)与客服接入 url,填入 `WXWORK_CORP_ID` / `WXWORK_KF_URL`。
- 不启用可跳过。

### 5. 代码托管 / 部署方式
- 客户有 GitHub 仓库:建议用 GitHub 托管代码,并接微信云托管的 GitHub 部署(推送即部署),适合长期维护。
- 没有:走手动部署云托管——用 `deploy_cloudrun`(@wxcloud/cli),或在微信云托管控制台手动上传 / 构建(不使用 CLI)。
- 确认云托管环境 id,填入 `WXCLOUD_ENV_ID`。

## 完成标志
appid、金数据 Key/Secret 已配置;出口 IP 已提交白名单;上传密钥就绪;部署方式已选定。齐了就进入阶段二(`frontend-demo` / `jinshuju-schema` / `deploy`)。
