---
layout: home

hero:
  name: "HedgeDoc API 文檔"
  text: "完整的整合指南"
  tagline: API 使用、測試結果、部署指南與故障排查
  actions:
    - theme: brand
      text: 快速開始
      link: /quick-start
    - theme: alt
      text: 標準操作指南
      link: /01-guide/1.1-standard-operation-guide

features:
  - icon: ⚡
    title: Quick Start
    details: 5 分鐘快速上手 HedgeDoc API，包含實用的 curl 範例
    link: /quick-start
  
  - icon: 📖
    title: 使用指南
    details: 詳細的 HedgeDoc API 操作流程，包括認證、文件管理和 n8n 整合
    link: /01-guide/1.0-overview
  
  - icon: 🔌
    title: API 參考
    details: 完整的 API 測試結果與驗證報告
    link: /02-api-reference/2.0-overview
  
  - icon: 🚀
    title: 部署指南
    details: VitePress、Railway 和 Cloudflare Worker 完整部署流程
    link: /03-deployment/3.0-overview
  
  - icon: 🔧
    title: 故障排查
    details: 常見問題、失敗經驗和解決方案
    link: /04-troubleshooting/4.0-overview
  
  - icon: 📦
    title: 歷史歸檔
    details: 過往測試記錄與參考文件
    link: /05-archive/5.0-overview
---

## 💡 關於本文檔

這個文檔站記錄了 HedgeDoc API 的完整使用經驗，包括：

### ✅ 成功方案
- 經過驗證的 API 使用方法
- n8n 自動化整合範例
- 生產環境部署配置

### 📋 完整記錄
- 所有測試過程和結果
- 失敗的嘗試和經驗教訓
- 故障排查和解決方案

### 🎯 推薦閱讀路徑

**初次使用者**：
1. [Quick Start](/quick-start) → 5 分鐘快速上手
2. [使用指南](/01-guide/1.0-overview) → 了解基本操作
3. [API 參考](/02-api-reference/2.0-overview) → 查看測試結果
4. [故障排查](/04-troubleshooting/4.0-overview) → 避免常見錯誤

**部署人員**：
1. [部署指南](/03-deployment/3.0-overview) → 完整部署流程
2. [VitePress 設置](/03-deployment/3.1-vitepress-setup) → 文檔站設置
3. [Cloudflare Worker](/03-deployment/3.3-cloudflare-worker) → 反向代理配置

---

## 🔗 關於 HedgeDoc

HedgeDoc 是一個開源的協作 Markdown 編輯器，支援：
- 即時多人協作編輯
- 豐富的 Markdown 語法
- 簡單的 HTTP API

本文檔專注於 HedgeDoc 的 API 整合與自動化使用場景。

**官方資源**：
- [HedgeDoc 官網](https://hedgedoc.org/)
- [HedgeDoc GitHub](https://github.com/hedgedoc/hedgedoc)
- [API 文檔](https://docs.hedgedoc.org/dev/api/)
