---
title: n8n HedgeDoc 整合設置指南
---

# n8n HedgeDoc 整合設置指南

解決 n8n 中 HedgeDoc API 返回 HTML 頁面的問題

---

## 🐛 問題現象

### 你可能遇到的問題

當你在 n8n 中使用 HTTP Request 節點創建 HedgeDoc 筆記時：

**預期結果**：
```json
{
  "statusCode": 302,
  "headers": {
    "location": "https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/abc123"
  }
}
```

**實際結果**：
```json
{
  "statusCode": 200,
  "data": "<!DOCTYPE html>...<title>HedgeDoc</title>..."
}
```

返回的是 **HTML 頁面內容**，而不是 302 redirect！

---

## 🔍 根本原因

### n8n vs curl 的行為差異

| 工具 | 預設行為 | 結果 |
|------|---------|------|
| **curl -i** | 顯示 302，不跟隨 redirect | ✅ 看到 Location header |
| **n8n HTTP Request** | 自動跟隨 redirect | ❌ 返回目標頁面的 HTML |

### 發生了什麼？

```
1. n8n 發送: POST /api/hedgedoc/new
   ↓
2. Gateway 返回: 302 Found
   Location: /api/hedgedoc/abc123
   ↓
3. n8n 自動跟隨 redirect:
   GET /api/hedgedoc/abc123  ← 注意：變成 GET 請求了！
   ↓
4. HedgeDoc 返回: 200 OK + HTML 頁面（筆記的網頁版本）
```

**問題**：n8n 自動將 POST redirect 轉換為 GET 請求，並訪問了筆記的網頁版本。

---

## ✅ 解決方案

### 步驟 1: HTTP Request 節點基本設置

1. 打開你的 n8n workflow
2. 添加或編輯 **HTTP Request** 節點
3. 設置如下：

```
Method: POST
URL: https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/new
Authentication: None (我們用 Header 傳遞 Token)
```

---

### 步驟 2: 設置 Headers

點擊 **"Add Parameter"** 兩次，添加以下 headers：

#### Header 1: API Token
```
Name: X-API-Key
Value: ntk_your_token_here
```

💡 **建議**：使用環境變數
```
Value: {{$env.HEDGEDOC_TOKEN}}
```

#### Header 2: Content Type
```
Name: Content-Type
Value: text/markdown
```

---

### 步驟 3: 設置 Request Body

1. 滾動到 **"Send Body"** 區塊
2. 啟用 **"Send Body"** 開關 ✅
3. 設置：

```
Body Content Type: Raw/JSON
```

4. 在 Body 欄位輸入你的 Markdown 內容：

```markdown
# 我的筆記標題

## 內容區塊

這是我的筆記內容。

- 支援完整的 Markdown 語法
- 可以包含程式碼區塊
- 支援表格、清單等

**創建完成！**
```

💡 **使用變數**（從上一個節點獲取）：
```
# {{$json.title}}

{{$json.content}}
```

---

### 步驟 4: 設置 Options（🔥 關鍵步驟）

滾動到 **"Options"** 區塊，設置以下三個選項：

#### ✅ Ignore Response Code
```
☑ Ignore Response Code
```
**作用**：允許 3xx 狀態碼，不將 302 視為錯誤

#### ❌ Follow Redirect（最重要！）
```
☐ Follow Redirect
```
**作用**：**禁止自動跟隨 redirect**，這是解決問題的關鍵！

#### ✅ Return Full Response
```
☑ Return Full Response
```
**作用**：返回完整響應，包含 headers（我們需要從中提取 Location）

---

### 步驟 5: 提取 Note ID

創建筆記後，你會收到：

```json
{
  "statusCode": 302,
  "statusMessage": "Found",
  "headers": {
    "location": "https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/wnfpKmINSbGiZGIaEbucSw",
    "content-type": "text/html; charset=utf-8",
    ...
  }
}
```

#### 方法 A: 使用 Code 節點（推薦）

添加一個 **Code** 節點：

```javascript
// 從 HTTP Response 中提取 Location
const location = $input.item.json.headers.location;

// 從 URL 中提取 Note ID（最後一段）
const noteId = location.split('/').pop();

// 返回結構化數據
return {
  noteId: noteId,
  noteUrl: location,
  webUrl: location.replace('/api/hedgedoc', '')  // 網頁版 URL
};
```

**輸出**：
```json
{
  "noteId": "wnfpKmINSbGiZGIaEbucSw",
  "noteUrl": "https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/wnfpKmINSbGiZGIaEbucSw",
  "webUrl": "https://hedgedoc.example.com/note-id"
}
```

#### 方法 B: 使用 Set 節點

添加一個 **Set** 節點：

```
Operation: Set
Fields to Set:
  - Name: noteId
    Value: {{$json.headers.location.split('/').pop()}}
  
  - Name: noteUrl  
    Value: {{$json.headers.location}}
```

---

## 📋 完整的 n8n Workflow 範例

### 範例 1: 創建筆記並讀取內容

```
[Manual Trigger]
     ↓
[Set Node] - 設置筆記內容
     ↓
[HTTP Request] - 創建筆記
  • Method: POST
  • URL: .../api/hedgedoc/new
  • Options: Follow Redirect = OFF
     ↓
[Code Node] - 提取 Note ID
     ↓
[HTTP Request] - 讀取筆記內容
  • Method: GET
  • URL: .../api/hedgedoc/{{$json.noteId}}/download
```

### Set Node 範例數據

```json
{
  "title": "測試筆記",
  "content": "這是測試內容\n\n- 項目 1\n- 項目 2"
}
```

### HTTP Request 1 (創建) - 完整配置

```
Method: POST
URL: https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/new

Headers:
  X-API-Key: {{$env.HEDGEDOC_TOKEN}}
  Content-Type: text/markdown

Send Body: ON
Body Content Type: Raw/JSON
Body:
# {{$json.title}}

{{$json.content}}

Options:
  ☑ Ignore Response Code
  ☐ Follow Redirect  ← 必須關閉
  ☑ Return Full Response
```

### Code Node 範例

```javascript
// 提取 Location header
const location = $input.item.json.headers.location;
const noteId = location.split('/').pop();

return {
  noteId: noteId,
  noteUrl: location,
  title: $input.item.json.title || '未命名',
  createdAt: new Date().toISOString()
};
```

### HTTP Request 2 (讀取) - 完整配置

```
Method: GET
URL: https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/{{$json.noteId}}/download

Headers:
  X-API-Key: {{$env.HEDGEDOC_TOKEN}}
```

**輸出**：完整的 Markdown 內容

---

## 🧪 測試清單

### ✅ 驗證設置是否正確

測試你的 workflow：

1. **創建筆記節點應該返回**：
   ```json
   {
     "statusCode": 302,
     "headers": {
       "location": "https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/..."
     }
   }
   ```
   ✅ 如果看到這個，設置正確！
   ❌ 如果看到 HTML (`<!DOCTYPE html>`)，檢查 "Follow Redirect" 是否關閉

2. **Code 節點應該返回**：
   ```json
   {
     "noteId": "abc123xyz",
     "noteUrl": "https://..."
   }
   ```

3. **讀取節點應該返回**：
   ```
   # 測試筆記
   
   這是測試內容
   ```
   ✅ 如果看到 Markdown，成功！

---

## 🔧 常見問題排查

### Q1: 為什麼我還是看到 HTML？

**檢查清單**：
- [ ] "Follow Redirect" 是否已**關閉**？
- [ ] "Ignore Response Code" 是否已**啟用**？
- [ ] "Return Full Response" 是否已**啟用**？

### Q2: 為什麼返回 401 錯誤？

```json
{
  "error": "Invalid API Key"
}
```

**檢查清單**：
- [ ] Token 是否正確？
- [ ] Header 名稱是否為 `X-API-Key`（注意大小寫）？
- [ ] Token 是否已過期或被撤銷？

### Q3: 如何使用環境變數？

1. 在 n8n 中設置環境變數（Settings → Variables）：
   ```
   Name: HEDGEDOC_TOKEN
   Value: ntk_your_actual_token_here
   ```

2. 在 HTTP Request 節點中使用：
   ```
   Value: {{$env.HEDGEDOC_TOKEN}}
   ```

### Q4: 為什麼 Code 節點報錯？

```
Cannot read property 'location' of undefined
```

**原因**：上一個節點沒有返回完整響應

**解決**：確保 HTTP Request 節點啟用了 "Return Full Response"

### Q5: curl 可以但 n8n 不行？

這是正常的！因為：
- curl `-i` 不跟隨 redirect
- n8n 預設跟隨 redirect

**解決**：按照本指南設置 "Follow Redirect = OFF"

---

## 💡 最佳實踐

### 1. 使用環境變數管理 Token

```
❌ 不好：直接寫在節點中
Value: ntk_SHJtugzk__UyMjpr2rhMeU3NAOV3UhgR1Bj-peq2qqQ

✅ 好：使用環境變數
Value: {{$env.HEDGEDOC_TOKEN}}
```

### 2. 錯誤處理

添加 **IF** 節點檢查響應：

```javascript
// 檢查是否成功創建
if ($json.statusCode === 302 && $json.headers.location) {
  return { success: true };
} else {
  return { success: false, error: 'Failed to create note' };
}
```

### 3. 記錄日誌

使用 **Set** 節點記錄重要資訊：

```
Fields to Set:
  - Name: log
    Value: Created note: {{$json.noteId}} at {{$now}}
```

### 4. 重試機制

在 HTTP Request 節點的 Options 中：

```
☑ Retry on Fail
Max Retries: 3
Wait Between Retries: 1000 (ms)
```

---

## 📚 進階範例

### 範例 2: 批量創建筆記

```
[Webhook/Manual Trigger] - 接收文章列表
     ↓
[Split In Batches] - 分批處理（避免速率限制）
     ↓
[HTTP Request] - 創建筆記
     ↓
[Code] - 提取 Note ID
     ↓
[Set] - 記錄結果
     ↓
[Aggregate] - 匯總所有結果
```

### 範例 3: 定期備份筆記

```
[Cron Trigger] - 每天凌晨 2:00
     ↓
[HTTP Request] - 讀取筆記列表（從你的資料庫）
     ↓
[Loop] - 遍歷每個筆記
     ↓
[HTTP Request] - 讀取筆記內容
     ↓
[Write File] - 保存到本地/雲端
```

### 範例 4: 從 RSS 自動創建筆記

```
[RSS Feed Trigger] - 監控 RSS
     ↓
[Code] - 轉換為 Markdown 格式
     ↓
[HTTP Request] - 創建 HedgeDoc 筆記
     ↓
[Slack/Discord] - 發送通知
```

---

## 🆘 還是不行？

### Debug 步驟

1. **查看完整輸出**：
   ```
   在節點上右鍵 → "Copy input to clipboard"
   在文本編輯器中查看完整 JSON
   ```

2. **使用 n8n 的測試功能**：
   ```
   點擊節點 → "Test step"
   查看實際發送的請求和響應
   ```

3. **對比 curl 結果**：
   ```bash
   # 在終端中測試相同的請求
   curl -X POST https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/new \
     -H "X-API-Key: your_token" \
     -H "Content-Type: text/markdown" \
     -d "# Test" \
     -i
   ```

4. **檢查 Gateway 日誌**：
   - 前往 Token Manager Dashboard
   - 查看最近的 API 調用記錄

---

## 📖 相關資源

- **快速參考指南**：[hedgedoc-gateway-quick-reference.md](./hedgedoc-gateway-quick-reference.md)
- **Token Manager 指南**：[token-manager-guide.md](./token-manager-guide.md)
- **測試報告**：[GATEWAY-TEST-REPORT.md](../GATEWAY-TEST-REPORT.md)
- **n8n 官方文檔**：https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/

---

## ✅ 設置檢查清單

在你開始使用前，確認：

- [ ] Token 已創建並有效（在 Token Manager 中確認）
- [ ] Token 的 Scopes 包含 `hedgedoc` 或 `*`
- [ ] n8n 環境變數已設置（HEDGEDOC_TOKEN）
- [ ] HTTP Request 節點的 "Follow Redirect" 已**關閉**
- [ ] HTTP Request 節點的 "Ignore Response Code" 已**啟用**
- [ ] HTTP Request 節點的 "Return Full Response" 已**啟用**
- [ ] Headers 中包含 `X-API-Key` 和 `Content-Type`
- [ ] 使用 Code 或 Set 節點提取 Note ID
- [ ] 已測試並成功創建筆記

---

**最後更新**：2025-11-09  
**版本**：v1.0  
**狀態**：✅ 已驗證可用

