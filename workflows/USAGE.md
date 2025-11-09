# Workflow 範本使用說明

快速上手 HedgeDoc + n8n 整合

---

## ⚡ 5 秒鐘快速開始

1. **下載範本**：[hedgedoc-create-and-read-template.json](./hedgedoc-create-and-read-template.json)
2. **匯入 n8n**：右上角「⋯」→「Import from File」
3. **替換 Token**：在「Content Parameter」節點中修改 `YOUR_TOKEN_HERE`
4. **執行**：點擊「Execute workflow」
5. **完成**！✅

---

## 📝 範本說明

### Workflow 流程

```
觸發
  ↓
設置內容和 Token
  ↓
創建 HedgeDoc 筆記 (302 redirect)
  ↓
提取 Note ID 和生成 URLs
  ↓
  ├─ 讀取筆記內容 (Markdown)
  ├─ 獲取筆記元數據 (JSON)
  └─ 整理各種訪問 URLs
```

### 輸出的 URLs

執行完成後，你會得到：

```json
{
  "noteId": "abc123",
  "directUrl": "https://hedgedoc.example.com/abc123",
  "editUrl": "https://hedgedoc.example.com/abc123?edit",
  "bothUrl": "https://hedgedoc.example.com/abc123?both",
  "viewUrl": "https://hedgedoc.example.com/abc123?view",
  ...
}
```

**用途**：
- `editUrl` - 給編輯者使用（整頁編輯器）
- `bothUrl` - 給作者使用（邊寫邊看預覽）
- `viewUrl` - 給讀者使用（只讀模式）
- `directUrl` - 預設訪問（自動判斷權限）

---

## 🔧 自定義範本

### 修改筆記內容

打開「Content Parameter」節點，找到：

```javascript
"Markdown Article": "=# 測試筆記標題\n\n你的內容..."
```

改為你想要的內容。

### 使用變數

如果你想從前面的節點獲取內容：

```javascript
"Markdown Article": "={{ $json.myContent }}"
```

### 使用環境變數（推薦）

在 n8n Settings → Variables 中設置：

```
Name: HEDGEDOC_TOKEN
Value: ntk_your_actual_token_here
```

然後在範本中：

```javascript
"token_manager_key": "={{ $env.HEDGEDOC_TOKEN }}"
```

---

## ⚠️ 常見錯誤

### 錯誤 1：返回 HTML 頁面

**症狀**：
```json
{
  "statusCode": 200,
  "data": "<!DOCTYPE html>..."
}
```

**原因**：Follow Redirects 沒有關閉

**解決**：
1. 打開「創建筆記」節點
2. 滾動到 Options → Redirects
3. 確認 Follow Redirects = **OFF**（灰色）

### 錯誤 2：顯示 302 錯誤

**症狀**：
```
NodeApiError: 302 - "Found. Redirecting to..."
```

**原因**：Never Error 沒有啟用

**解決**：
1. 打開「創建筆記」節點
2. 滾動到 Options → Response
3. 確認 Never Error = **ON**（綠色）

### 錯誤 3：Code 節點報錯

**症狀**：
```
Cannot read property 'location' of undefined
```

**原因**：Include Response Headers and Status 沒有啟用

**解決**：
1. 打開「創建筆記」節點
2. 滾動到 Options → Response
3. 確認 Include Response Headers and Status = **ON**（綠色）

### 錯誤 4：401 Unauthorized

**症狀**：
```json
{
  "error": "Invalid API Key"
}
```

**原因**：Token 無效或未設置

**解決**：
1. 檢查「Content Parameter」節點的 `token_manager_key`
2. 確認 Token 有效（到 Token Manager 檢查）
3. 確認 Token 的 Scopes 包含 `hedgedoc` 或 `*`

---

## 🎯 實際應用場景

### 場景 1：自動發布文章到 HedgeDoc

```
[Webhook Trigger] - 接收新文章
     ↓
[Code] - 轉換為 Markdown 格式
     ↓
[使用此範本] - 創建 HedgeDoc 筆記
     ↓
[Slack] - 發送通知（包含 editUrl）
```

### 場景 2：RSS 轉 HedgeDoc

```
[RSS Feed Trigger] - 監控 RSS
     ↓
[Filter] - 篩選新文章
     ↓
[Code] - 格式化為 Markdown
     ↓
[使用此範本] - 創建 HedgeDoc 筆記
     ↓
[Database] - 記錄 Note ID
```

### 場景 3：批量備份

```
[Cron Trigger] - 每日執行
     ↓
[Database] - 讀取所有 Note IDs
     ↓
[Loop] - 遍歷每個 Note
     ↓
[HTTP Request] - 讀取內容
     ↓
[Write File] - 保存到本地
```

---

## 📞 需要幫助？

### 查看文檔

- **設置問題**：[docs/n8n-setup-guide.md](../docs/n8n-setup-guide.md)
- **API 使用**：[docs/hedgedoc-gateway-quick-reference.md](../docs/hedgedoc-gateway-quick-reference.md)
- **問題排查**：[docs/04-troubleshooting/4.4-n8n-hedgedoc-redirect-issue.md](../docs/04-troubleshooting/4.4-n8n-hedgedoc-redirect-issue.md)

### 聯繫支援

- Token Manager Dashboard：https://token.example.com
- 查看 API 日誌和使用狀況
- 聯繫 Core Team

---

**建立日期**：2025-11-09  
**範本版本**：v1.0  
**狀態**：✅ 已驗證可用  
**適用 n8n 版本**：>= 1.0.0

