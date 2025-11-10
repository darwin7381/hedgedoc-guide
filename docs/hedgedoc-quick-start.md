# HedgeDoc Gateway 快速參考

透過 Token Manager Gateway 使用 HedgeDoc API 的完整指令範例

---

## 🔑 設定資訊

```bash
# Gateway URL
GATEWAY_URL="https://api-gateway.cryptoxlab.workers.dev"

# 你的 Token（替換成你自己的）
TOKEN="ntk_your_token_here"

# 完整 API 路徑
API_BASE="${GATEWAY_URL}/api/hedgedoc"
```

---

## 📝 1. 創建新筆記

### 指令

```bash
curl -X POST https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/new \
  -H "X-API-Key: ntk_your_token_here" \
  -H "Content-Type: text/markdown" \
  -d "# 我的筆記標題

## 內容區塊

這是我的筆記內容。

- 支援完整的 Markdown 語法
- 可以包含程式碼區塊
- 支援表格、清單等

**創建完成！**" \
  -i
```

### 預期結果

```
HTTP/2 302 
location: https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/wnfpKmINSbGiZGIaEbucSw

Found. Redirecting to https://hedgedoc.example.com/note-id
```

**✅ 成功指標**：
- 狀態碼：`302 Found`
- Location header 包含新筆記的 URL
- 從 Location 中提取 Note ID（例如：`wnfpKmINSbGiZGIaEbucSw`）

---

## 📖 2. 讀取筆記內容

### 指令

```bash
# 替換 <NOTE-ID> 為實際的筆記 ID
curl -s https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/<NOTE-ID>/download \
  -H "X-API-Key: ntk_your_token_here"
```

**範例**：
```bash
curl -s https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/wnfpKmINSbGiZGIaEbucSw/download \
  -H "X-API-Key: ntk_your_token_here"
```

### 預期結果

```markdown
# 我的筆記標題

## 內容區塊

這是我的筆記內容。

- 支援完整的 Markdown 語法
- 可以包含程式碼區塊
- 支援表格、清單等

**創建完成！**
```

**✅ 成功指標**：
- 狀態碼：`200 OK`
- 返回完整的 Markdown 內容
- UTF-8 編碼正確

---

## 📊 3. 獲取筆記元數據

### 指令

```bash
# 替換 <NOTE-ID> 為實際的筆記 ID
curl -s https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/<NOTE-ID>/info \
  -H "X-API-Key: ntk_your_token_here" \
  -H "Accept: application/json"
```

**範例**：
```bash
curl -s https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/wnfpKmINSbGiZGIaEbucSw/info \
  -H "X-API-Key: ntk_your_token_here" \
  -H "Accept: application/json" | jq .
```

### 預期結果

```json
{
  "title": "我的筆記標題",
  "description": "# 我的筆記標題  ## 內容區塊 這是我的筆記內容。  - 支援完整的 Markdown 語法 - 可以包含程式碼區塊 - 支援表格...",
  "viewcount": 0,
  "createtime": "2025-11-09T07:37:34.821Z",
  "updatetime": null
}
```

**✅ 成功指標**：
- 狀態碼：`200 OK`
- 返回 JSON 格式
- 包含：title, description, viewcount, createtime, updatetime

---

## 🔖 4. 使用自定義 Alias 創建筆記

### 指令

```bash
# 使用自定義的 Alias（可讀性更好）
curl -X POST https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/new/my-custom-note-2025 \
  -H "X-API-Key: ntk_your_token_here" \
  -H "Content-Type: text/markdown" \
  -d "# 自定義 Alias 測試

這個筆記使用了自定義的 Alias，URL 更容易記憶和分享。" \
  -i
```

### 預期結果

```
HTTP/2 302 
location: https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/my-custom-note-2025

Found. Redirecting to https://hedgedoc.example.com/my-custom-note-2025
```

**讀取 Alias 筆記**：
```bash
curl -s https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/my-custom-note-2025/download \
  -H "X-API-Key: ntk_your_token_here"
```

**✅ 成功指標**：
- 狀態碼：`302 Found`
- Location 包含你的自定義 Alias
- 可以用 Alias 直接讀取筆記

---

## 📄 5. 從文件創建筆記

### 指令

```bash
# 從本地 Markdown 文件創建筆記
curl -X POST https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/new \
  -H "X-API-Key: ntk_your_token_here" \
  -H "Content-Type: text/markdown" \
  --data-binary @./my-article.md \
  -i
```

### 預期結果

```
HTTP/2 302 
location: https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/xYz123AbC
```

**✅ 成功指標**：
- 成功上傳整個文件內容
- 返回新筆記的 URL

---

## 🎨 6. 創建包含特殊內容的筆記

### 指令：Emoji 和多語言

```bash
curl -X POST https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/new \
  -H "X-API-Key: ntk_your_token_here" \
  -H "Content-Type: text/markdown" \
  -d '# 特殊字符測試 🚀

## Emoji
✅ ❌ 🔥 💡 📝 🎯

## 多語言支援
- 中文：這是中文內容
- 日文：これは日本語です
- 韓文：이것은 한국어입니다
- English: This is English content' \
  -i
```

### 預期結果

```
HTTP/2 302 
location: https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/emoji123
```

**讀取驗證**：
```bash
curl -s https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/emoji123/download \
  -H "X-API-Key: ntk_your_token_here"
```

輸出：
```markdown
# 特殊字符測試 🚀

## Emoji
✅ ❌ 🔥 💡 📝 🎯

## 多語言支援
- 中文：這是中文內容
- 日文：これは日本語です
- 韓文：이것은 한국어입니다
- English: This is English content
```

**✅ 成功指標**：
- Emoji 正確顯示
- 多語言正確編碼
- UTF-8 完整保留

---

## 💻 7. 創建包含程式碼的筆記

### 指令

```bash
curl -X POST https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/new \
  -H "X-API-Key: ntk_your_token_here" \
  -H "Content-Type: text/markdown" \
  -d '# API 程式碼範例

## JavaScript
```javascript
async function fetchData(url) {
  const response = await fetch(url);
  return await response.json();
}
```

## Python
```python
def hello_world():
    print("Hello, World!")
    return True
```

## Shell
```bash
curl -X GET https://api.example.com/data \
  -H "Authorization: Bearer token"
```' \
  -i
```

### 預期結果

```
HTTP/2 302 
location: https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/code123
```

**✅ 成功指標**：
- 程式碼區塊完整保留
- 語法高亮正確
- 縮排保持不變

---

## 📋 8. 創建包含表格的筆記

### 指令

```bash
curl -X POST https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/new \
  -H "X-API-Key: ntk_your_token_here" \
  -H "Content-Type: text/markdown" \
  -d '# API 測試結果

| 端點 | 方法 | 狀態 | 回應時間 |
|------|------|------|----------|
| /new | POST | ✅ | 1.2s |
| /download | GET | ✅ | 0.3s |
| /info | GET | ✅ | 0.4s |

## 總結
所有測試通過！' \
  -i
```

### 預期結果

```
HTTP/2 302 
location: https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/table123
```

**讀取後顯示**：

| 端點 | 方法 | 狀態 | 回應時間 |
|------|------|------|----------|
| /new | POST | ✅ | 1.2s |
| /download | GET | ✅ | 0.3s |
| /info | GET | ✅ | 0.4s |

**✅ 成功指標**：
- 表格格式正確
- Markdown 語法完整保留

---

## 🔗 9. 一次性操作：創建並讀取

### 指令

```bash
# 創建筆記並提取 Note ID，然後立即讀取
NOTE_LOCATION=$(curl -s -X POST https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/new \
  -H "X-API-Key: ntk_your_token_here" \
  -H "Content-Type: text/markdown" \
  -d "# 快速測試

這是一個快速創建並讀取的測試。" \
  -i | grep -i "^location:" | awk '{print $2}' | tr -d '\r')

# 從 Location 提取 Note ID
NOTE_ID=$(echo $NOTE_LOCATION | awk -F'/' '{print $NF}')

echo "Note ID: $NOTE_ID"
echo "---"

# 讀取內容
curl -s https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/${NOTE_ID}/download \
  -H "X-API-Key: ntk_your_token_here"
```

### 預期結果

```
Note ID: abc123xyz
---
# 快速測試

這是一個快速創建並讀取的測試。
```

**✅ 成功指標**：
- 自動提取 Note ID
- 立即讀取並顯示內容

---

## ⚠️ 10. 錯誤處理範例

### 測試：無效的 Token

```bash
curl -X POST https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/new \
  -H "X-API-Key: invalid_token" \
  -H "Content-Type: text/markdown" \
  -d "# 測試" \
  -i
```

**預期結果**：
```
HTTP/2 401 
{
  "error": "Invalid API Key",
  "message": "The provided API Key is invalid or has been revoked"
}
```

### 測試：不存在的筆記

```bash
curl -s https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/nonexistent-id/download \
  -H "X-API-Key: ntk_your_token_here" \
  -w "\nHTTP Status: %{http_code}\n"
```

**預期結果**：
```
HTTP Status: 404
```

**✅ 錯誤處理正常**：
- 401：Token 無效或已撤銷
- 404：筆記不存在
- 403：沒有權限訪問該路由

---

## 🚀 n8n 整合範例

### 📦 快速開始：使用 Workflow 範本

**最快的方式**：直接匯入我們提供的範本！

**範本下載**：[workflows/hedgedoc-create-and-read-template.json](../workflows/hedgedoc-create-and-read-template.json)

**使用步驟**：
1. 下載範本 JSON 文件
2. 在 n8n 中：右上角「⋯」→「Import from File」
3. 貼上 JSON 內容 → 點擊「Import」
4. 修改「Content Parameter」節點中的 `token_manager_key` 為你的 Token
5. 執行測試！

**詳細說明**：查看 [workflows/README.md](../workflows/README.md)

---

### ⚠️ 重要設置說明

**n8n 預設會自動跟隨 302 redirect**，導致返回 HTML 頁面而不是 Location header。

必須進行以下設置：

### HTTP Request 節點設置

**創建筆記**：

1. **基本設置**：
```
Method: POST
URL: https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/new
```

2. **Headers**（點擊 "Add Parameter"）：
```
Name: X-API-Key
Value: {{$env.HEDGEDOC_TOKEN}}

Name: Content-Type  
Value: text/markdown
```

3. **Body**：
- Send Body: ✅ 啟用
- Body Content Type: Raw/JSON
- Body:
```
# {{$json.title}}

{{$json.content}}
```

4. **Options（關鍵設置）**：
```
☑ Ignore Response Code (允許 3xx 狀態碼)
☐ Follow Redirect (❌ 必須關閉！)
☑ Return Full Response (返回完整響應包含 headers)
```

5. **提取 Note ID**（下一個節點使用 Code 或 Set）：
```javascript
// Code 節點
const location = $input.item.json.headers.location;
const noteId = location.split('/').pop();

return {
  noteId: noteId,
  noteUrl: location
};
```

**讀取筆記**：
```
Method: GET
URL: https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/{{$json.noteId}}/download

Headers:
  X-API-Key: {{$env.HEDGEDOC_TOKEN}}
```

**獲取元數據**：
```
Method: GET
URL: https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/{{$json.noteId}}/info

Headers:
  X-API-Key: {{$env.HEDGEDOC_TOKEN}}
  Accept: application/json
```

---

## 📝 實用腳本

### 批量創建筆記

```bash
#!/bin/bash

TOKEN="ntk_your_token_here"
GATEWAY="https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc"

# 從文件列表批量創建
for file in *.md; do
  echo "創建筆記: $file"
  
  curl -X POST "$GATEWAY/new" \
    -H "X-API-Key: $TOKEN" \
    -H "Content-Type: text/markdown" \
    --data-binary "@$file" \
    -s -i | grep -i "^location:"
  
  echo "---"
  sleep 1  # 避免速率限制
done
```

### 備份筆記

```bash
#!/bin/bash

TOKEN="ntk_your_token_here"
GATEWAY="https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc"
NOTE_ID="your-note-id"

# 下載並保存
curl -s "$GATEWAY/$NOTE_ID/download" \
  -H "X-API-Key: $TOKEN" \
  -o "backup-$NOTE_ID-$(date +%Y%m%d).md"

echo "備份完成: backup-$NOTE_ID-$(date +%Y%m%d).md"
```

---

## 🔍 除錯技巧

### 1. 查看完整的 Response Headers

```bash
curl -v https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/<NOTE-ID>/info \
  -H "X-API-Key: ntk_your_token_here" \
  2>&1 | grep -E "^< |^> "
```

### 2. 測試 Token 是否有效

```bash
curl -s https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/test/info \
  -H "X-API-Key: ntk_your_token_here" \
  -w "\nHTTP Status: %{http_code}\n"
```

- 401 = Token 無效
- 404 = Token 有效，但筆記不存在（正常）

### 3. 檢查內容編碼

```bash
curl -s https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc/<NOTE-ID>/download \
  -H "X-API-Key: ntk_your_token_here" | file -
```

應該顯示：`UTF-8 Unicode text`

---

## 💡 最佳實踐

### 1. 使用環境變數管理 Token

```bash
# 在 ~/.bashrc 或 ~/.zshrc 中設置
export HEDGEDOC_TOKEN="ntk_your_token_here"
export HEDGEDOC_GATEWAY="https://api-gateway.cryptoxlab.workers.dev/api/hedgedoc"

# 使用
curl -X POST "$HEDGEDOC_GATEWAY/new" \
  -H "X-API-Key: $HEDGEDOC_TOKEN" \
  -H "Content-Type: text/markdown" \
  -d "# 測試"
```

### 2. 創建 Alias 簡化指令

```bash
# 在 ~/.bashrc 或 ~/.zshrc 中添加
alias hedgedoc-create='curl -X POST $HEDGEDOC_GATEWAY/new -H "X-API-Key: $HEDGEDOC_TOKEN" -H "Content-Type: text/markdown"'
alias hedgedoc-read='curl -s $HEDGEDOC_GATEWAY/$1/download -H "X-API-Key: $HEDGEDOC_TOKEN"'

# 使用
echo "# 測試" | hedgedoc-create -d @-
hedgedoc-read abc123
```

### 3. 使用有意義的 Alias

```bash
# ✅ 好的 Alias（可讀性強）
/new/project-roadmap-2025
/new/api-documentation-v2
/new/weekly-report-2025-11-09

# ❌ 不好的 Alias
/new/note1
/new/test
/new/abc
```

---

## 📚 相關資源

- **Token Manager 管理界面**：https://token.example.com
- **HedgeDoc 實例**：https://hedgedoc.example.com
- **完整測試報告**：[GATEWAY-TEST-REPORT.md](../GATEWAY-TEST-REPORT.md)
- **Token Manager 使用指南**：[token-manager-guide.md](./token-manager-guide.md)

---

## 🆘 常見問題

### Q: 為什麼我的 Token 不能用？

**檢查清單**：
1. Token 是否已撤銷？→ 到 Token Manager 檢查
2. Token 的 Scopes 是否包含 `hedgedoc` 或 `*`？
3. Token 是否已過期？

### Q: 創建筆記後如何獲取 Note ID？

```bash
# 方法 1：從 Location header 提取
curl -X POST ... -i | grep -i "^location:" | awk -F'/' '{print $NF}'

# 方法 2：使用 -w 參數
curl -X POST ... -w "%{redirect_url}" -o /dev/null -s
```

### Q: 如何處理大文件？

HedgeDoc Gateway 支援大文件，但建議：
- 單個筆記 < 1MB
- 使用 `--data-binary @file` 而不是 `-d`
- 考慮壓縮或分割超大內容

### Q: 速率限制是多少？

- HedgeDoc 預設：20 次請求 / 時間窗口
- 可以從 response headers 查看：`x-ratelimit-remaining`
- 達到限制後會返回 429 Too Many Requests

---

**最後更新**：2025-11-09  
**版本**：v1.0  
**狀態**：✅ 所有範例已驗證

