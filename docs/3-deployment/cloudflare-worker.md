# Cloudflare Worker 反向代理設置指南

> **專案**：HedgeDoc 文檔站反向代理  
> **實現日期**：2025-11-06  
> **目標**：透過 Cloudflare Worker 將 `hedgedoc.example.com/docs` 代理到 Railway 部署的 VitePress 文檔站

---

## 📋 目錄

1. [架構概述](#架構概述)
2. [VitePress 配置](#vitepress-配置)
3. [Cloudflare Worker 設置](#cloudflare-worker-設置)
4. [DNS 和路由配置](#dns-和路由配置)
5. [重要教訓](#重要教訓)
6. [故障排查](#故障排查)
7. [完整檢查清單](#完整檢查清單)

---

## 🏗️ 架構概述

### 最終架構

```
用戶瀏覽器
    ↓
https://hedgedoc.example.com/docs
    ↓
Cloudflare (DNS Proxied)
    ↓
Cloudflare Worker (路由分發)
    ↓
    ├─ /docs/* → Railway VitePress (hedgedoc-guide-production.up.railway.app)
    └─ /* → 直接通過 → HedgeDoc 原站
```

### 域名結構

- `https://hedgedoc.example.com` → HedgeDoc 服務
- `https://hedgedoc.example.com/docs` → VitePress 文檔站

---

## ⚙️ VitePress 配置

### 必要配置項

**檔案位置**：`docs/.vitepress/config.ts`

```typescript
export default defineConfig({
  base: '/docs/',  // ⚠️ 關鍵配置！必須設置
  title: 'HedgeDoc 測試文檔',
  description: 'HedgeDoc API 測試與整合指南',
  
  // 其他重要配置
  ignoreDeadLinks: true,  // 避免建置時 dead links 導致失敗
  cleanUrls: true,
  
  markdown: {
    html: false,  // 防止 <NOTE> 等被誤判為 Vue 組件
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    config: (md) => {
      // 自動轉義 {{ }} 語法，避免 Vue SSR 錯誤
      const defaultRender = md.render.bind(md)
      md.render = (src, env) => {
        const safeSrc = src.replace(/\{\{([^}]+)\}\}/g, '&#123;&#123;$1&#125;&#125;')
        return defaultRender(safeSrc, env)
      }
    }
  }
})
```

### 為什麼必須設置 `base: '/docs/'`？

**原因**：
1. VitePress 需要知道它部署在哪個子路徑下
2. 所有資源路徑（CSS、JS、圖片）都會加上 `/docs/` 前綴
3. 所有內部連結都會加上 `/docs/` 前綴
4. 這樣 Cloudflare Worker 才能正確攔截所有相關請求

**效果**：
- 資源路徑：`/docs/assets/style.css`（而不是 `/assets/style.css`）
- 內部連結：`/docs/STANDARD-OPERATION-GUIDE`（而不是 `/STANDARD-OPERATION-GUIDE`）

---

## 🔧 Cloudflare Worker 設置

### 步驟 1：創建 Worker

1. 登入 Cloudflare Dashboard
2. 選擇你的帳號
3. 左側菜單選擇 **Workers & Pages**
4. 點擊 **Create application** → **Create Worker**
5. 給 Worker 命名（例如：`md-blocktempoai-docs-proxy`）
6. 點擊 **Deploy**

### 步驟 2：編輯 Worker 代碼

點擊 **Edit Code**，使用以下代碼：

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // VitePress 在 Railway 的 URL
    const VITEPRESS_URL = 'https://hedgedoc-guide-production.up.railway.app';
    
    // 只處理 /docs 開頭的請求
    if (url.pathname.startsWith('/docs')) {
      // 保持完整路徑，直接轉發
      const targetUrl = `${VITEPRESS_URL}${url.pathname}${url.search}`;
      
      return fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
    }
    
    // 其他所有請求保持不變（直接通過）
    return fetch(request);
  }
}
```

### 步驟 3：保存並部署

點擊 **Save and Deploy**

---

## 🌐 DNS 和路由配置

### DNS 設置（關鍵！）

1. 在 Cloudflare Dashboard 中選擇域名 `blocktempo.ai`
2. 左側選擇 **DNS**
3. 找到 `hedgedoc.example.com` 的記錄
4. **確認 Proxy status 是 🟠 Proxied（橘色雲朵）**
   - **這是必須的！** Worker 只在 Proxied 狀態下才會執行
   - 如果是灰色雲朵（DNS Only），Worker 不會觸發

### Worker Routes 設置

1. 在 Cloudflare Dashboard 中選擇域名 `blocktempo.ai`
2. 左側選擇 **Workers Routes**
3. 點擊 **Add route**
4. 設置：
   - **Route**: `hedgedoc.example.com/*`
   - **Service**: 選擇你的 Worker（`md-blocktempoai-docs-proxy`）
   - **Environment**: Production
5. 點擊 **Save**

---

## 🎓 重要教訓

### 1. Worker 代碼的關鍵原則

**❌ 錯誤做法**：
```javascript
// 移除 /docs 前綴再轉發
const newPath = url.pathname.replace(/^\/docs/, '') || '/';
const targetUrl = `${VITEPRESS_URL}${newPath}`;
```
**問題**：會訪問 Railway 的根路徑 `/`，但 VitePress 配置了 `base: '/docs/'`，期待在 `/docs/` 下運行，導致 404。

**✅ 正確做法**：
```javascript
// 保持完整路徑
const targetUrl = `${VITEPRESS_URL}${url.pathname}`;
```
**原因**：VitePress 設置了 `base: '/docs/'`，所以在 Railway 上也是在 `/docs/` 路徑下運行。

### 2. 不要過度判斷請求類型

**❌ 錯誤做法**：
```javascript
if (url.pathname.startsWith('/docs') || 
    url.pathname.endsWith('.js') || 
    url.pathname.endsWith('.css')) {
  // 轉發到 VitePress
}
```
**問題**：
- HedgeDoc 自己也有 `.js` 和 `.css` 文件
- 這樣會把 HedgeDoc 的資源也誤判為 VitePress 的
- 導致主站崩潰

**✅ 正確做法**：
```javascript
if (url.pathname.startsWith('/docs')) {
  // 只處理明確以 /docs 開頭的
}
```
**原因**：VitePress 的 `base: '/docs/'` 確保所有資源都在 `/docs/` 下。

### 3. HEDGEDOC_URL 的陷阱

**❌ 錯誤做法**：
```javascript
const HEDGEDOC_URL = 'https://hedgedoc.example.com';

// 其他請求轉發到 HedgeDoc
const targetUrl = `${HEDGEDOC_URL}${url.pathname}`;
return fetch(targetUrl);
```
**問題**：會造成**無限循環**！Worker 會一直轉發給自己。

**✅ 正確做法**：
```javascript
// 直接通過，不做任何處理
return fetch(request);
```
**原因**：HedgeDoc 已經綁定在 `hedgedoc.example.com` 上，直接讓請求通過即可。

### 4. DNS Proxied 狀態是必須的

**為什麼必須是 Proxied（🟠 橘色雲朵）**：
- Cloudflare Workers **只在 Proxied 模式下執行**
- DNS Only（灰色雲朵）模式下，流量直接到源站，Worker 不會觸發

**潛在風險**：
- 如果 HedgeDoc 之前是 DNS Only，改成 Proxied 可能影響 WebSocket 連線
- 即時協作功能可能需要額外配置 Cloudflare 的 WebSocket 支援

**解決方案**：
- 在 Cloudflare Dashboard → 域名設置 → Network 中確認 WebSocket 已啟用

---

## 🔍 故障排查

### 問題 1：訪問 /docs 顯示 404

**症狀**：
- 訪問 `https://hedgedoc.example.com/docs` 返回 404
- HTML 內容來自 VitePress（可以從 title 看出）

**原因**：
- VitePress 沒有設置 `base: '/docs/'`
- Worker 移除了 `/docs` 前綴但 VitePress 期待在根目錄

**解決**：
- 在 VitePress 配置中添加 `base: '/docs/'`
- Worker 保持完整路徑轉發

### 問題 2：頁面顯示但沒有樣式

**症狀**：
- HTML 內容正常
- 但 CSS、JS 無法載入
- 瀏覽器 Console 顯示 404 錯誤

**原因 A**：Worker 沒有轉發資源請求
- 檢查：資源路徑是 `/assets/...` 還是 `/docs/assets/...`？
- 如果是 `/assets/...`：VitePress 沒有設置 base
- 解決：添加 `base: '/docs/'`

**原因 B**：Worker Route 沒有設置或沒生效
- 檢查：Worker Routes 是否正確設置
- 檢查：DNS 是否為 Proxied 狀態
- 解決：設置 Route 並確保 DNS Proxied

### 問題 3：主網站也壞了

**症狀**：
- `https://hedgedoc.example.com` 也無法訪問
- 或者顯示 VitePress 的 404 頁面

**原因**：Worker 的判斷邏輯太寬鬆
- 例如：判斷了 `.js`, `.css` 等副檔名
- 導致 HedgeDoc 的資源也被轉發到 VitePress

**解決**：
- Worker 只判斷 `url.pathname.startsWith('/docs')`
- 移除所有副檔名判斷
- 其他請求用 `return fetch(request)` 直接通過

### 問題 4：無限循環或 520 錯誤

**症狀**：
- 瀏覽器顯示 520 錯誤
- Cloudflare 顯示 "Web server is returning an unknown error"

**原因**：
- Worker 中的 `HEDGEDOC_URL` 設置為 `https://hedgedoc.example.com`
- 造成 Worker 轉發給自己，無限循環

**解決**：
- 移除 HEDGEDOC_URL
- 使用 `return fetch(request)` 直接通過

---

## 📊 Railway 部署配置

### Start Command 設置

在 Railway Service Settings → Deploy：

```
Start Command:
npm run docs:dev -- --port $PORT --host 0.0.0.0
```

**為什麼用開發模式**：
- ✅ 不需要預先建置（避免建置錯誤）
- ✅ 自動忽略 dead links
- ✅ 啟動更快
- ✅ 功能完全相同

**不推薦使用 preview 模式**：
- 需要先執行 build
- Railway 的 Nixpacks 可能不會自動執行 build
- 容易出現 "ENOENT: no such file or directory, open '/app/docs/.vitepress/dist/404.html'" 錯誤

---

## 🎯 完整的 Cloudflare Worker 代碼

### 最終版本（已驗證可用）

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // VitePress 在 Railway 的 URL
    const VITEPRESS_URL = 'https://hedgedoc-guide-production.up.railway.app';
    
    // 只處理 /docs 開頭的請求
    if (url.pathname.startsWith('/docs')) {
      // 保持完整路徑，直接轉發到 Railway
      const targetUrl = `${VITEPRESS_URL}${url.pathname}${url.search}`;
      
      return fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
    }
    
    // 其他所有請求保持不變（HedgeDoc 處理）
    return fetch(request);
  }
}
```

### 代碼說明

**第 1-2 行**：解析請求 URL
```javascript
const url = new URL(request.url);
```

**第 5 行**：定義 VitePress 的 Railway URL
```javascript
const VITEPRESS_URL = 'https://hedgedoc-guide-production.up.railway.app';
```
- ⚠️ 這是 Railway 自動生成的域名
- ⚠️ 不要用自訂域名，避免循環

**第 8-15 行**：處理 `/docs` 請求
```javascript
if (url.pathname.startsWith('/docs')) {
  const targetUrl = `${VITEPRESS_URL}${url.pathname}${url.search}`;
  return fetch(targetUrl, { ... });
}
```
- 保持完整路徑：`/docs` → `/docs`
- 保持查詢參數：`?page=1` 等
- 轉發所有 headers 和 body

**第 18 行**：其他請求直接通過
```javascript
return fetch(request);
```
- **不要**寫成 `fetch(HEDGEDOC_URL + ...)`
- 直接 `fetch(request)` 讓請求保持原樣

---

## 🔑 關鍵知識點

### 1. Cloudflare Worker 的執行時機

Worker 在以下情況下執行：
- ✅ DNS 記錄是 **Proxied** 狀態（🟠 橘色雲朵）
- ✅ 已設置 **Worker Route** 匹配該域名
- ✅ 請求經過 Cloudflare 的 CDN

Worker 不會執行：
- ❌ DNS 記錄是 **DNS Only** 狀態（灰色雲朵）
- ❌ 沒有設置 Worker Route
- ❌ 請求直接到源站（繞過 Cloudflare）

### 2. Worker Route 的格式

**正確格式**：
```
hedgedoc.example.com/*
```

**錯誤格式**：
- ❌ `https://hedgedoc.example.com/*`（不需要協議）
- ❌ `hedgedoc.example.com*`（缺少 `/`）
- ❌ `*.blocktempo.ai/*`（會匹配所有子域名）

### 3. VitePress base path 的影響

**當設置 `base: '/docs/'` 時**：

生成的 HTML：
```html
<link href="/docs/assets/style.css">
<script src="/docs/assets/app.js"></script>
<a href="/docs/guide">Guide</a>
```

**當沒有設置 base 時**：

生成的 HTML：
```html
<link href="/assets/style.css">
<script src="/assets/app.js"></script>
<a href="/guide">Guide</a>
```

### 4. 為什麼不需要重寫 HTML？

因為 VitePress 的 `base: '/docs/'` 已經讓所有路徑都是正確的：
- 資源：`/docs/assets/...` ✅
- 連結：`/docs/page-name` ✅
- Worker 只需要簡單轉發 `/docs` 開頭的請求即可

**不需要使用 HTMLRewriter** - 這會增加複雜度且不必要。

---

## ⚠️ 常見錯誤與解決

### 錯誤 1：試圖重寫路徑

```javascript
// ❌ 錯誤
const newPath = url.pathname.replace(/^\/docs/, '');
```

**為什麼錯誤**：
- Railway 上的 VitePress 也配置了 `base: '/docs/'`
- 它期待訪問 `/docs/` 路徑
- 移除前綴會導致訪問 `/`，返回 404

### 錯誤 2：判斷文件類型

```javascript
// ❌ 錯誤
if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
  // 轉發到 VitePress
}
```

**為什麼錯誤**：
- HedgeDoc 也有 `.js` 和 `.css` 文件
- 會誤判並破壞主站

### 錯誤 3：設置多個轉發目標

```javascript
// ❌ 錯誤
const HEDGEDOC_URL = 'https://hedgedoc.example.com';
const targetUrl = `${HEDGEDOC_URL}${url.pathname}`;
return fetch(targetUrl);
```

**為什麼錯誤**：
- 會造成無限循環
- Worker 會不斷轉發給自己

**✅ 正確做法**：
```javascript
return fetch(request);  // 直接通過
```

### 錯誤 4：修改 response headers

```javascript
// ⚠️ 通常不需要
const newResponse = new Response(response.body, response);
newResponse.headers.delete('X-Frame-Options');
return newResponse;
```

**說明**：
- 大多數情況下不需要修改 headers
- 只在特殊需求時才修改（如 CORS、X-Frame-Options 等）
- 簡單的反向代理直接 `return fetch(...)` 即可

---

## 🧪 測試與驗證

### 測試清單

使用終端機測試：

```bash
# 測試 HTML 是否正確載入
curl -s https://hedgedoc.example.com/docs | head -20

# 測試資源是否可訪問
curl -I https://hedgedoc.example.com/docs/assets/style.css

# 測試主站是否正常
curl -I https://hedgedoc.example.com

# 檢查資源路徑
curl -s https://hedgedoc.example.com/docs | grep -o 'href="[^"]*"' | head -10
```

### 瀏覽器測試

1. **強制重新整理**：Cmd+Shift+R（Mac）或 Ctrl+Shift+F5（Windows）
2. **無痕模式測試**：避免快取影響
3. **開發者工具檢查**：
   - Console：查看 JavaScript 錯誤
   - Network：確認所有資源都載入成功（綠色）
   - Elements：檢查 DOM 結構是否完整

---

## 📝 部署流程總結

### 完整步驟

1. **VitePress 配置**
   - 設置 `base: '/docs/'`
   - 設置 `markdown.html: false`
   - 添加 `{{ }}` 轉義邏輯

2. **推送到 GitHub**
   ```bash
   git push
   ```

3. **Railway 自動部署**
   - 自動檢測到 push
   - 執行 `npm run docs:dev`
   - 約 1-2 分鐘完成

4. **創建 Cloudflare Worker**
   - 使用簡化版代碼（只轉發 `/docs`）
   - Save and Deploy

5. **設置 Worker Route**
   - `hedgedoc.example.com/*` → Worker

6. **確認 DNS Proxied**
   - 確保橘色雲朵

7. **測試**
   - 訪問 `https://hedgedoc.example.com/docs`
   - 強制重新整理

---

## 💡 最佳實踐

### Worker 代碼應該保持簡單

**原則**：
- 只做必要的路由分發
- 不要過度處理或修改請求
- 不要重寫 HTML（除非絕對必要）
- 不要修改 headers（除非絕對必要）

### VitePress 配置應該正確

**原則**：
- 正確設置 `base` 路徑
- 處理好 Vue 模板語法衝突
- 處理好 HTML 標籤衝突

### 測試要徹底

**原則**：
- 不要假設成功，要實際測試
- 使用終端機工具驗證
- 檢查主站和子站都正常

---

## 📚 參考資源

- [Cloudflare Workers 官方文檔](https://developers.cloudflare.com/workers/)
- [VitePress 部署指南](https://vitepress.dev/guide/deploy)
- [Railway 部署文檔](https://docs.railway.app/)

---

## ✅ 最終配置檢查清單

部署前確認：

- [ ] VitePress 配置中有 `base: '/docs/'`
- [ ] VitePress 配置中有 `markdown.html: false`
- [ ] VitePress 配置中有 `{{ }}` 轉義邏輯
- [ ] 已推送到 GitHub
- [ ] Railway 已成功部署
- [ ] Railway Start Command 是 `npm run docs:dev`
- [ ] Cloudflare Worker 代碼只判斷 `/docs` 開頭
- [ ] Cloudflare Worker 代碼使用 `fetch(request)` 處理其他請求
- [ ] Worker Route 設置為 `hedgedoc.example.com/*`
- [ ] DNS 記錄是 Proxied 狀態（🟠 橘色雲朵）
- [ ] 已測試 `https://hedgedoc.example.com`（HedgeDoc 正常）
- [ ] 已測試 `https://hedgedoc.example.com/docs`（文檔站正常）

---

**最後更新**：2025-11-06  
**維護者**：AI Assistant  
**狀態**：✅ 已驗證可用

