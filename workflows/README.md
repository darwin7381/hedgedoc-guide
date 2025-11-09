# n8n Workflow 範本

這個目錄包含可以直接匯入 n8n 的 workflow 範本。

---

## 📦 可用範本

### 1. HedgeDoc - 創建並讀取筆記

**檔案**：`hedgedoc-create-and-read-template.json`

**功能**：
- ✅ 透過 Token Manager Gateway 創建 HedgeDoc 筆記
- ✅ 自動提取 Note ID
- ✅ 生成所有訪問 URL（編輯、雙開、只讀等）
- ✅ 讀取筆記內容
- ✅ 獲取筆記元數據

**包含節點**：
1. Manual Trigger - 手動觸發
2. Content Parameter - 設置 Token 和內容
3. 創建筆記 - POST /new（已設置正確的 redirect 處理）
4. 整理新 markdown 文件輸出參數 - 提取 Note ID 和生成 URLs
5. 讀取 markdown 文件內容 - GET /download
6. 讀取元數據 - GET /info
7. 各版本 view - 整理編輯/預覽 URLs

---

## 🚀 如何使用

### 步驟 1: 下載範本

**方法 A**：直接複製 JSON
1. 打開 `hedgedoc-create-and-read-template.json`
2. 複製全部內容

**方法 B**：使用 curl 下載（如果已部署到 GitHub）
```bash
curl -o hedgedoc-workflow.json \
  https://raw.githubusercontent.com/darwin7381/hedgedoc-guide/main/workflows/hedgedoc-create-and-read-template.json
```

### 步驟 2: 匯入到 n8n

1. 開啟 n8n
2. 點擊右上角「⋯」（三個點）
3. 選擇「Import from File」或「Import from URL」
4. 貼上 JSON 內容或選擇下載的文件
5. 點擊「Import」

### 步驟 3: 設置 Token

找到 **「Content Parameter」** 節點，修改：

```javascript
// 找到這一行
"token_manager_key": "YOUR_TOKEN_HERE"

// 改為你的實際 Token
"token_manager_key": "ntk_your_actual_token_here"

// 或使用環境變數（推薦）
"token_manager_key": "={{ $env.HEDGEDOC_TOKEN }}"
```

### 步驟 4: 自定義內容（可選）

在 **「Content Parameter」** 節點中修改 `Markdown Article` 的值：

```markdown
# 你的筆記標題

你的筆記內容...
```

### 步驟 5: 執行測試

1. 點擊「Execute workflow」按鈕
2. 查看每個節點的輸出
3. 驗證是否成功：
   - ✅ 「創建筆記」返回 302 + Location header
   - ✅ 「整理參數」輸出所有 URLs
   - ✅ 「讀取內容」返回 Markdown
   - ✅ 「讀取元數據」返回 JSON

---

## 🔧 設置說明

### 必須設置的選項

**在「創建筆記」節點的 Options 中**：

```
Redirects:
  ☐ Follow Redirects (必須關閉)

Response:
  ☑ Include Response Headers and Status (必須開啟)
  ☑ Never Error (必須開啟)
```

**這些設置已包含在範本中**，但如果你修改了節點，請確保這些選項正確。

---

## 📊 範本輸出說明

### 「整理新 markdown 文件輸出參數」節點輸出

```json
{
  "noteId": "AQY5Z-KpQxyoK4JAOtTfcw",
  
  "gatewayUrl": "https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/AQY5Z-KpQxyoK4JAOtTfcw",
  "downloadUrl": "https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/AQY5Z-KpQxyoK4JAOtTfcw/download",
  "infoUrl": "https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/AQY5Z-KpQxyoK4JAOtTfcw/info",
  
  "directUrl": "https://hedgedoc.example.com/note-id",
  "editUrl": "https://hedgedoc.example.com/note-id?edit",
  "bothUrl": "https://hedgedoc.example.com/note-id?both",
  "viewUrl": "https://hedgedoc.example.com/note-id?view",
  
  "createdAt": "2025-11-09T10:15:33.123Z"
}
```

### URL 使用說明

| URL | 用途 | 何時使用 |
|-----|------|---------|
| `gatewayUrl` | 透過 Gateway 訪問 | API 調用時 |
| `downloadUrl` | 下載 Markdown 內容 | 需要純文字內容時 |
| `infoUrl` | 獲取元數據 | 需要標題、時間等資訊時 |
| `directUrl` | 直接網頁訪問 | 分享給他人查看 |
| `editUrl` | 整頁編輯模式 | 需要編輯筆記時 |
| `bothUrl` | 雙開編輯模式 | 邊寫邊看預覽時 |
| `viewUrl` | 只讀模式 | 只需查看不需編輯時 |

---

## 💡 自定義範本

### 修改筆記內容

在「Content Parameter」節點中：

```javascript
{
  "Markdown Article": "# 你的標題\n\n你的內容...",
  "token_manager_key": "YOUR_TOKEN_HERE"
}
```

### 使用動態內容

如果你想從上一個節點獲取內容：

```javascript
{
  "Markdown Article": "={{ $json.articleContent }}",
  "token_manager_key": "={{ $env.HEDGEDOC_TOKEN }}"
}
```

### 添加錯誤處理

在「創建筆記」節點後添加 **IF** 節點：

```javascript
// 檢查是否成功
{{ $json.statusCode === 302 && $json.headers.location }}
```

---

## 🧪 驗證範本是否正確

### 檢查清單

匯入範本後，檢查以下項目：

- [ ] 「創建筆記」節點的 URL 正確
- [ ] 「創建筆記」節點的 Options 設置正確：
  - [ ] Follow Redirects = OFF
  - [ ] Never Error = ON
  - [ ] Include Response Headers and Status = ON
- [ ] 「Content Parameter」節點的 Token 已替換
- [ ] 所有連線都正確（沒有斷開的線）
- [ ] 執行測試成功

### 預期結果

執行成功後：

1. **「創建筆記」節點**：
   - statusCode: 302
   - headers.location: 包含新筆記 URL

2. **「整理參數」節點**：
   - 輸出 9 個欄位（noteId, 各種 URLs, createdAt）

3. **「讀取內容」節點**：
   - 返回完整的 Markdown 文字

4. **「讀取元數據」節點**：
   - 返回 JSON（title, description, viewcount...）

5. **「各版本 view」節點**：
   - 輸出 3 個欄位（雙開模式、純編輯模式、純閱讀模式）

---

## 🆘 常見問題

### Q: 匯入後所有節點都是紅色的？

**原因**：節點類型不相容或 n8n 版本太舊

**解決**：
1. 確認 n8n 版本 >= 1.0.0
2. 更新 n8n 到最新版本
3. 或手動重新創建節點

### Q: 執行後返回 401 錯誤？

**原因**：Token 未設置或無效

**解決**：
1. 檢查「Content Parameter」節點的 `token_manager_key` 值
2. 確認 Token 有效且未過期
3. 確認 Token 的 Scopes 包含 `hedgedoc` 或 `*`

### Q: 執行後返回 HTML 頁面？

**原因**：「創建筆記」節點的 Options 設置錯誤

**解決**：
1. 檢查 Follow Redirects 是否**關閉**
2. 檢查 Never Error 是否**開啟**
3. 檢查 Include Response Headers and Status 是否**開啟**

---

## 📚 相關文檔

- **完整設置指南**：[n8n-setup-guide.md](../docs/n8n-setup-guide.md)
- **快速參考**：[hedgedoc-gateway-quick-reference.md](../docs/hedgedoc-gateway-quick-reference.md)
- **問題排查**：[4.4-n8n-hedgedoc-redirect-issue.md](../docs/04-troubleshooting/4.4-n8n-hedgedoc-redirect-issue.md)
- **Token Manager 指南**：[token-manager-guide.md](../docs/token-manager-guide.md)

---

## 🎯 最佳實踐

### 1. 使用環境變數

```
❌ 不要：直接寫 Token 在節點中
"token_manager_key": "ntk_SHJtugzk__UyMjpr2rhMeU3NAOV3UhgR1Bj-peq2qqQ"

✅ 建議：使用環境變數
"token_manager_key": "={{ $env.HEDGEDOC_TOKEN }}"
```

### 2. 保存為你自己的範本

修改後，在 n8n 中：
1. 點擊「⋯」→「Duplicate」
2. 重新命名（例如：「HedgeDoc - 新聞稿發布」）
3. 根據你的需求調整

### 3. 添加錯誤通知

在 workflow 最後添加：
- Slack 通知
- Email 通知
- Discord webhook

### 4. 定期測試

建議每週執行一次測試，確保：
- Token 仍然有效
- Gateway 正常運作
- HedgeDoc 服務可用

---

**最後更新**：2025-11-09  
**範本版本**：v1.0  
**狀態**：✅ 已驗證可用

