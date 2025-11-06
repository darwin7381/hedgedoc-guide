# Quick Start

快速開始使用 HedgeDoc API

## 🚀 5 分鐘上手

HedgeDoc 提供簡單的 HTTP API，讓你可以透過程式化方式創建和管理 Markdown 筆記。

## 📝 基本概念

- **HedgeDoc 實例**：`https://hedgedoc.example.com`
- **API 端點**：直接使用 HTTP 請求
- **認證**：不需要 API Token（公開實例）
- **內容格式**：純 Markdown

## ⚡ 快速範例

### 創建一個新筆記

```bash
curl -X POST https://hedgedoc.example.com/new \
  -H "Content-Type: text/markdown" \
  -d "# 我的第一個筆記

這是透過 API 創建的筆記！

## 功能測試
- 支援完整的 Markdown 語法
- 可以包含程式碼區塊
- 支援表格、清單等

**測試成功！**" \
  -i
```

**回應**：
```
HTTP/2 302
location: https://hedgedoc.example.com/YOUR-NOTE-ID
```

新筆記的 URL 在 `location` header 中！

### 讀取筆記內容

```bash
# 使用上一步得到的 NOTE-ID
curl -s https://hedgedoc.example.com/YOUR-NOTE-ID/download
```

**回應**：
```markdown
# 我的第一個筆記

這是透過 API 創建的筆記！
...
```

### 獲取筆記資訊

```bash
curl -s https://hedgedoc.example.com/YOUR-NOTE-ID/info
```

**回應**：
```json
{
  "title": "我的第一個筆記",
  "description": "...",
  "viewcount": 0,
  "createtime": "2025-11-06T...",
  "updatetime": null
}
```

## 🔄 編輯筆記的方法

HedgeDoc 沒有直接的編輯 API，但可以透過以下方式：

### 方法：下載 → 修改 → 創建新版本

```bash
# 1. 下載原始內容
ORIGINAL=$(curl -s https://hedgedoc.example.com/YOUR-NOTE-ID/download)

# 2. 組合新內容
NEW_CONTENT="$ORIGINAL

---

## 新增的章節
這是新增的內容！"

# 3. 創建新版本
echo "$NEW_CONTENT" | curl -X POST https://hedgedoc.example.com/new \
  -H "Content-Type: text/markdown" \
  --data-binary @- \
  -i
```

## 🎯 常用場景

### 場景 1：從文件創建筆記

```bash
curl -X POST https://hedgedoc.example.com/new \
  -H "Content-Type: text/markdown" \
  --data-binary @my-article.md \
  -i
```

### 場景 2：使用自定義 Alias

```bash
curl -X POST https://hedgedoc.example.com/new/my-custom-alias \
  -H "Content-Type: text/markdown" \
  -d "# 自定義 Alias 測試" \
  -i
```

筆記 URL 將是：`https://hedgedoc.example.com/my-custom-alias`

### 場景 3：在 n8n 中使用

**HTTP Request 節點設置**：
- Method: `POST`
- URL: `https://hedgedoc.example.com/new`
- Headers:
  ```
  Content-Type: text/markdown
  ```
- Body: 選擇 "Raw/JSON"，輸入 Markdown 內容

**獲取新筆記 URL**：
```
{{ $response.headers.location }}
```

## 📚 進階使用

想了解更多？查看：

- [標準操作指南](/1. 使用指南/1.1 標準操作指南) - 完整的 API 操作流程
- [驗證報告](/2. API 參考/2.1 驗證報告) - 所有 API 端點的測試結果
- [故障排查](/4. 故障排查/4.1 失敗嘗試歸檔) - 常見問題和解決方案

## ⚠️ 重要提示

### 支援的 API

✅ **可用**：
- `POST /new` - 創建新筆記
- `GET /<NOTE>/download` - 讀取筆記
- `GET /<NOTE>/info` - 獲取元數據
- `POST /new/<ALIAS>` - 使用自定義 alias

❌ **不可用**：
- `PUT /<NOTE>` - 沒有直接編輯 API
- `DELETE /<NOTE>` - 需透過 Web UI 刪除

### 速率限制

- 預設：20 次請求 / 時間窗口
- 可從 response headers 查看剩餘次數：
  ```
  x-ratelimit-limit: 20
  x-ratelimit-remaining: 19
  ```

## 🔗 相關資源

- [HedgeDoc 官方 API 文檔](https://docs.hedgedoc.org/dev/api/)
- [HedgeDoc GitHub](https://github.com/hedgedoc/hedgedoc)
- [本站完整指南](/1. 使用指南/1.1 標準操作指南)

