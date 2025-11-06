# HedgeDoc API 使用指南

> 完整的 HedgeDoc API 整合文檔，包含使用指南、測試結果、部署流程和故障排查

## 📚 線上文檔

**🌐 訪問完整文檔站**：https://md.blocktempo.ai/docs

包含：
- ⚡ Quick Start - 5 分鐘快速上手
- 📖 使用指南 - 完整的 API 操作流程
- 🔌 API 參考 - 測試結果與驗證報告
- 🚀 部署指南 - VitePress、Railway、Cloudflare Worker
- 🔧 故障排查 - 常見問題和解決方案
- 📦 歷史歸檔 - 過往測試記錄

## 🚀 快速開始

### 創建新筆記

```bash
curl -X POST https://md.blocktempo.ai/new \
  -H "Content-Type: text/markdown" \
  -d "# 我的筆記

這是透過 API 創建的筆記！" \
  -i
```

### 讀取筆記

```bash
curl -s https://md.blocktempo.ai/<NOTE-ID>/download
```

## 📖 本地開發

### 安裝依賴

```bash
npm install
```

### 啟動文檔站

```bash
npm run docs:dev
```

文檔站會在 http://localhost:5173 啟動（或其他可用端口）

### 建置生產版本

```bash
npm run docs:build
```

## 📂 專案結構

```
.
├── docs/                          # VitePress 文檔源文件
│   ├── .vitepress/               # VitePress 配置
│   ├── quick-start.md            # 快速開始
│   ├── 01-guide/                 # 使用指南
│   ├── 02-api-reference/         # API 參考
│   ├── 03-deployment/            # 部署指南
│   ├── 04-troubleshooting/       # 故障排查
│   └── 05-archive/               # 歷史歸檔
├── README.md                      # 本文件
├── VITEPRESS-SETUP-GUIDE.md      # VitePress 詳細設置指南
├── CLOUDFLARE-WORKER-SETUP-GUIDE.md  # Cloudflare Worker 設置指南
├── GITHUB-SETUP.md               # GitHub 和 Railway 部署指南
└── package.json                  # 專案配置
```

## 🔑 重要文檔（給開發者）

- [VITEPRESS-SETUP-GUIDE.md](./VITEPRESS-SETUP-GUIDE.md) - VitePress 完整設置、配置和重要教訓
- [CLOUDFLARE-WORKER-SETUP-GUIDE.md](./CLOUDFLARE-WORKER-SETUP-GUIDE.md) - Cloudflare Worker 反向代理完整指南
- [GITHUB-SETUP.md](./GITHUB-SETUP.md) - GitHub 和 Railway 部署流程

## 🌐 部署資訊

- **文檔站**：https://md.blocktempo.ai/docs
- **GitHub 倉庫**：https://github.com/darwin7381/hedgedoc-guide
- **Railway 服務**：hedgedoc-guide-production
- **Cloudflare Worker**：md-blocktempoai-docs-proxy

## 📝 更新文檔

1. 編輯 `docs/` 目錄下的 markdown 文件
2. 提交並推送到 GitHub：
   ```bash
   git add .
   git commit -m "Update documentation"
   git push
   ```
3. Railway 會自動檢測並重新部署
4. 約 1-2 分鐘後，https://md.blocktempo.ai/docs 就會更新

## ⚠️ 重要提醒

### 文件命名規則
- ✅ 使用 kebab-case：`quick-start.md`, `1.1-standard-guide.md`
- ❌ 不要用空格：`Quick Start.md`
- ❌ 不要用中文：`標準操作指南.md`
- **原因**：會導致 VitePress 連結完全失效

### 端口管理
- ❌ 不要固定端口
- ❌ 不要清理其他應用的端口
- ✅ 讓開發伺服器自動分配

## 🔗 相關資源

- [HedgeDoc 官網](https://hedgedoc.org/)
- [HedgeDoc API 文檔](https://docs.hedgedoc.org/dev/api/)
- [VitePress 官方文檔](https://vitepress.dev/)
- [Cloudflare Workers 文檔](https://developers.cloudflare.com/workers/)

---

**專案建立日期**：2025-11-06  
**最後更新**：2025-11-06  
**維護者**：BlockTempo Tech Team
