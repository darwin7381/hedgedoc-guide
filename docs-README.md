# HedgeDoc 測試文檔站

這是一個使用 VitePress 建立的自動化文檔系統。

## 特色功能

- ✅ **自動掃描 Markdown 文件**：只要在 `docs/` 目錄中新增 `.md` 文件，會自動出現在側邊欄
- 🔍 **內建搜索功能**：快速找到需要的內容
- 🌓 **深色模式**：自動切換明暗主題
- 📱 **響應式設計**：支援各種螢幕尺寸
- 🚀 **極快的建置速度**：基於 Vite 的快速開發體驗

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run docs:dev
```

文檔站會在 `http://localhost:5173` 啟動

### 建置生產版本

```bash
npm run docs:build
```

建置結果會輸出到 `docs/.vitepress/dist`

### 預覽生產版本

```bash
npm run docs:preview
```

## 目錄結構

```
docs/
├── .vitepress/
│   ├── config.ts          # VitePress 配置文件
│   ├── cache/             # 快取目錄（自動生成）
│   └── dist/              # 建置輸出（自動生成）
├── index.md               # 首頁
├── archive/               # 歸檔文件
│   ├── hedgedoc-api-methods-comparison.md
│   ├── hedgedoc-api-test-results.md
│   └── ...
├── STANDARD-OPERATION-GUIDE.md
├── PROJECT-REORGANIZATION-SUMMARY.md
└── ... (其他 markdown 文件)
```

## 新增文件

### 在根目錄新增文件

直接在 `docs/` 目錄下新增 `.md` 文件：

```bash
# 新增一個新的指南
echo "# 新指南\n\n內容..." > docs/new-guide.md
```

重新整理瀏覽器，新文件會自動出現在側邊欄的「文檔」分類中。

### 新增子目錄

建立新目錄並新增文件：

```bash
# 建立新分類
mkdir docs/tutorials
echo "# 教學 1\n\n內容..." > docs/tutorials/tutorial-1.md
```

側邊欄會自動新增「Tutorials」分類。

## 配置說明

所有配置都在 `docs/.vitepress/config.ts` 中：

- **自動側邊欄生成**：`generateSidebar()` 函數會掃描 `docs/` 目錄
- **導航欄**：在 `themeConfig.nav` 中自訂
- **搜索**：使用內建的本地搜索
- **主題**：支援明暗模式切換

## 部署

### 部署到 Vercel

1. 推送到 GitHub
2. 在 Vercel 中匯入專案
3. 設定建置命令：`npm run docs:build`
4. 設定輸出目錄：`docs/.vitepress/dist`

### 部署到 Netlify

1. 推送到 GitHub
2. 在 Netlify 中匯入專案
3. 設定建置命令：`npm run docs:build`
4. 設定發佈目錄：`docs/.vitepress/dist`

### 部署到 GitHub Pages

```bash
# 建置
npm run docs:build

# 部署到 GitHub Pages
cd docs/.vitepress/dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:username/repo.git main:gh-pages
```

## 自訂樣式

如需自訂樣式，建立 `docs/.vitepress/theme/custom.css`：

```css
:root {
  --vp-c-brand: #646cff;
  --vp-c-brand-light: #747bff;
}
```

然後在 `docs/.vitepress/theme/index.ts` 中匯入。

## 技術支援

- [VitePress 官方文檔](https://vitepress.dev/)
- [VitePress GitHub](https://github.com/vuejs/vitepress)

