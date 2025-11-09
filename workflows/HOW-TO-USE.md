# 如何使用 HedgeDoc Workflow 範本

**最快速的 n8n 整合方式** - 只需 3 步驟！

---

## ⚡ 3 步驟快速開始

### 步驟 1：匯入範本到 n8n

在 n8n 中：
1. 點擊右上角「**⋯**」（三個點）
2. 選擇「**Import from URL**」
3. 貼上以下 URL：

```
https://raw.githubusercontent.com/darwin7381/hedgedoc-guide/main/workflows/hedgedoc-create-and-read-template.json
```

4. 點擊「**Import**」

### 步驟 2：設置你的 Token

找到 **「Content Parameter」** 節點：
1. 點擊節點打開編輯
2. 找到 `token_manager_key` 欄位
3. 將 `YOUR_TOKEN_HERE` 改為你的 Token

**推薦方式**（使用環境變數）：
```javascript
"={{ $env.HEDGEDOC_TOKEN }}"
```

### 步驟 3：執行測試

1. 點擊「**Execute workflow**」
2. 查看結果 ✅

**完成！** 🎉

---

## 📊 你會得到什麼

執行完成後，「整理新 markdown 文件輸出參數」節點會輸出：

```json
{
  "noteId": "abc123xyz",
  
  "gatewayUrl": "https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/abc123xyz",
  "downloadUrl": "https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/abc123xyz/download",
  "infoUrl": "https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/abc123xyz/info",
  
  "directUrl": "https://hedgedoc.example.com/abc123xyz",
  "editUrl": "https://hedgedoc.example.com/abc123xyz?edit",
  "bothUrl": "https://hedgedoc.example.com/abc123xyz?both",
  "viewUrl": "https://hedgedoc.example.com/abc123xyz?view"
}
```

### URL 用途說明

| URL | 用途 | 適合 |
|-----|------|------|
| `editUrl` | 整頁編輯器 | 專注寫作時使用 |
| `bothUrl` | 雙開模式（編輯+預覽） | 需要即時預覽時使用 |
| `viewUrl` | 只讀模式 | 分享給他人查看 |
| `directUrl` | 預設模式 | 一般訪問 |

---

## 🎯 實際應用範例

### 場景 1：發送筆記連結給編輯

```
創建筆記後 → 取得 editUrl → 發送 Slack 訊息
```

Slack 訊息範例：
```
新筆記已創建！
📝 編輯連結：{{$json.editUrl}}
👀 預覽連結：{{$json.viewUrl}}
```

### 場景 2：自動化內容發布

```
RSS Feed → 轉換格式 → 創建 HedgeDoc → 取得 bothUrl → 通知團隊審閱
```

### 場景 3：會議記錄自動化

```
會議結束 → Webhook 觸發 → 創建筆記 → 取得 editUrl → Email 給所有參與者
```

---

## ⚠️ 重要提醒

### 必須正確設置的選項

在「**創建筆記**」節點中，確認 Options 設置：

```
✅ 必須設置：

Redirects:
  ☐ Follow Redirects (關閉)

Response:
  ☑ Include Response Headers and Status (開啟)
  ☑ Never Error (開啟)
```

**這些設置已包含在範本中**，但如果你重新創建節點，務必再次設置！

---

## 🔍 驗證是否成功

### 成功的標誌

**「創建筆記」節點輸出**：
```json
{
  "statusCode": 302,  ← ✅ 必須是 302
  "headers": {
    "location": "https://..."  ← ✅ 必須有這個
  }
}
```

**「整理參數」節點輸出**：
```json
{
  "noteId": "...",  ← ✅ 有值
  "editUrl": "https://hedgedoc.example.com/...?edit",  ← ✅ 格式正確
  ...
}
```

### 失敗的標誌

❌ **如果看到**：
```json
{
  "statusCode": 200,
  "data": "<!DOCTYPE html>..."
}
```
→ Follow Redirects 沒有關閉

❌ **如果看到**：
```
NodeApiError: 302 - "Found..."
```
→ Never Error 沒有開啟

---

## 📚 更多資源

- **詳細設置指南**：[docs/n8n-setup-guide.md](../docs/n8n-setup-guide.md)
- **API 快速參考**：[docs/hedgedoc-gateway-quick-reference.md](../docs/hedgedoc-gateway-quick-reference.md)
- **問題排查**：[docs/04-troubleshooting/4.4-n8n-hedgedoc-redirect-issue.md](../docs/04-troubleshooting/4.4-n8n-hedgedoc-redirect-issue.md)

---

**最後更新**：2025-11-09  
**範本版本**：v1.0  
**測試狀態**：✅ 已完整驗證

