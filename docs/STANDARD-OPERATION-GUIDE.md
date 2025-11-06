# HedgeDoc API 標準操作指南

> **文件目的**：記錄正確、標準的 HedgeDoc API 操作方式，排除先前彎路測試的干擾

## ✅ 驗證狀態

### 官方文檔驗證
- ✅ **已查閱官方文檔**：[HedgeDoc API Documentation](https://docs.hedgedoc.org/dev/api/)
- ✅ **官方支援的方法**：
  - `POST /new` - 匯入 Markdown 資料到新筆記（需要 `Content-Type: text/markdown`）
  - `GET /<NOTE>/download` - 返回筆記的原始 Markdown 內容
  - `GET /<NOTE>/info` - 返回筆記的元數據
- ✅ **OpenAPI 規格**：[openapi.yml](https://docs.hedgedoc.org/dev/openapi.yml)

### 實際測試驗證
- ✅ **測試環境**：https://md.blocktempo.ai（HedgeDoc 1.10.3）
- ✅ **測試時間**：2025-11-05 19:17:33
- ✅ **測試工具**：curl（終端機實測）
- ✅ **測試結果**：所有核心功能測試成功（5/5 通過）

**已驗證的方法**：
- ✅ `POST /new` - 創建新筆記（測試成功，302 重定向）
- ✅ `GET /<NOTE>/download` - 讀取筆記內容（測試成功，內容完整）
- ✅ `GET /<NOTE>/info` - 獲取筆記資訊（測試成功，JSON 格式）
- ✅ `POST /new/<ALIAS>` - 帶 alias 創建（測試成功，自定義 URL）
- ✅ 內存編輯方法 - 下載 → 修改 → 重新創建（測試成功，版本追蹤）

**測試筆記連結**（可供檢查）：
- https://md.blocktempo.ai/43hzF0Y6R4u7VmcLrtn_5Q
- https://md.blocktempo.ai/DQiIxRKyTZir_f3nJBoXRw
- https://md.blocktempo.ai/test-alias-1762341481

**完整驗證報告**：請參閱 [`VERIFICATION-REPORT.md`](./VERIFICATION-REPORT.md)

### 官方文檔引用

根據 [HedgeDoc 官方 API 文檔](https://docs.hedgedoc.org/dev/api/)：

> **POST /new**: Imports some markdown data into a new note.
> 
> A random id will be assigned and the content will equal to the body of the received HTTP-request. 
> The `Content-Type: text/markdown` header should be set on this request.

> **GET /\<NOTE\>/download**: Returns the raw markdown content of a note.

**結論**：我們的標準操作方法 ✅ **完全符合官方文檔規範**

---

## 🎯 核心問題回顧

### 問題根源
- **現象**：n8n HTTP Request 節點無法正確調用 HedgeDoc API
- **表現**：終端機 curl 成功（302 重定向），但 n8n 失敗（200 + HTML 頁面）
- **影響**：導致測試了大量非正規方案，造成文件記錄混亂

### 解決方案
- **方法**：架設 router 中轉服務
- **原理**：n8n → router → HedgeDoc（router 確保使用正規 HTTP 傳遞方式）
- **結果**：解決了 n8n 無法正確傳遞請求的問題

---

## ✅ 標準操作方式

### 1. 創建新筆記（標準方法）

#### 終端機 curl（標準參考）

```bash
curl -X POST https://md.blocktempo.ai/new \
  -H "Content-Type: text/markdown" \
  -d "# 文章標題

文章內容...

## 子標題
- 項目 1
- 項目 2" \
  -i
```

**預期結果**：
- 狀態碼：`302` (重定向)
- 新筆記 URL：在 `location` header 中

#### n8n 標準工作流程（透過 router）

**節點配置**：

```
HTTP Request 節點
├─ Method: POST
├─ URL: [你的 router 服務 URL]/create-hedgedoc-note
├─ Headers:
│  └─ Content-Type: application/json
└─ Body (JSON):
   {
     "content": "# 文章標題\n\n文章內容...",
     "hedgedoc_url": "https://hedgedoc-production-bab4.up.railway.app"
   }
```

**router 服務應該做的事**：
1. 接收 n8n 的 JSON 請求
2. 提取 `content` 欄位
3. 以 `text/markdown` 格式轉發給 HedgeDoc
4. 返回新筆記 URL 給 n8n

---

### 2. 讀取筆記內容（標準方法）

#### 終端機 curl

```bash
curl -s https://md.blocktempo.ai/{NOTE_ID}/download
```

**預期結果**：
- 直接返回 Markdown 純文字內容

#### n8n 工作流程

```
HTTP Request 節點
├─ Method: GET
├─ URL: https://md.blocktempo.ai/{NOTE_ID}/download
└─ Response: Markdown 純文字
```

**不需要 router**：讀取操作 n8n 可以直接完成

---

### 3. 編輯筆記（標準方法）

> **重要**：HedgeDoc API 不支援直接編輯，標準做法是「下載 → 修改 → 創建新版本」

#### 終端機 curl 範例

```bash
# 步驟 1：下載現有內容
ORIGINAL=$(curl -s https://md.blocktempo.ai/{NOTE_ID}/download)

# 步驟 2：組合新內容並創建新版本
echo "$ORIGINAL

---

## 🔄 版本更新
- 更新時間: $(date '+%Y-%m-%d %H:%M:%S')
- 修改說明: 新增內容...

## 🆕 新增部分

新增的內容在這裡..." | \
curl -X POST https://md.blocktempo.ai/new \
  -H "Content-Type: text/markdown" \
  --data-binary @- \
  -i
```

#### n8n 標準工作流程

**節點 1：讀取原內容**
```
HTTP Request (讀取)
├─ Method: GET
└─ URL: https://md.blocktempo.ai/{NOTE_ID}/download
```

**節點 2：處理內容**
```
Code 節點
├─ Input: {{ $('HTTP Request').first().body }}
└─ Output: 
   {
     "content": originalContent + "\n\n---\n\n## 更新\n\n" + newContent
   }
```

**節點 3：創建新版本（透過 router）**
```
HTTP Request (創建)
├─ Method: POST
├─ URL: [router 服務]/create-hedgedoc-note
└─ Body: {{ $json.content }}
```

---

## 🚫 不應該使用的方法（彎路記錄）

以下是先前測試過但**不正規**或**不必要**的方法：

### ❌ 直接用 n8n HTTP Request 調用 HedgeDoc
- **問題**：n8n 無法正確設定 Content-Type 和 Body
- **結果**：總是回傳 200 + HTML 而非 302 重定向
- **結論**：不要再浪費時間調試 n8n 的 Raw/JSON/Form-Data 模式

### ❌ 使用臨時文件
- **問題**：增加複雜度，容器環境不友好
- **結論**：標準方法是內存操作，不需要文件系統

### ❌ 嘗試修改 User-Agent 或其他 Headers
- **問題**：這不是問題根源
- **結論**：問題在於 n8n 無法正確傳遞 Body，不是 Headers

### ❌ 使用 n8n Binary File 模式
- **問題**：這是為文件上傳設計的，不適合純文字
- **結論**：Markdown 內容應該作為文字傳遞

---

## 📊 測試結果總結

### 成功驗證的方法

| 方法 | 工具 | 狀態 | 說明 |
|-----|------|-----|------|
| 直接文字 POST | curl | ✅ | 標準參考方法 |
| 檔案上傳 POST | curl | ✅ | 適用於已有文件的情況 |
| 內存編輯 | curl | ✅ | 下載 → 修改 → 重新創建 |
| 透過 router | n8n | ✅ | **推薦的 n8n 方案** |
| 直接讀取 | n8n | ✅ | GET /download 直接可用 |

### 失敗的方法（已放棄）

| 方法 | 工具 | 問題 |
|-----|------|-----|
| Raw Body (text/markdown) | n8n | 總是回傳 200 + HTML |
| JSON Body (application/json) | n8n | 總是回傳 200 + HTML |
| Form-Data | n8n | 總是回傳 200 + HTML |
| Binary File | n8n | 錯誤：找不到 binary data |

---

## 🎯 最佳實踐建議

### 1. 創建新筆記
- ✅ **使用**：router 服務 + n8n
- ✅ **格式**：JSON 包含 Markdown 內容
- ✅ **驗證**：確認返回 302 狀態碼

### 2. 讀取筆記
- ✅ **使用**：直接 GET /download
- ✅ **不需要**：router（n8n 可以直接處理）

### 3. 編輯筆記
- ✅ **流程**：讀取 → 內存處理 → 創建新版本
- ✅ **版本管理**：在新版本中記錄原始筆記 ID
- ✅ **不使用**：文件系統（完全內存操作）

### 4. 版本追蹤
- ✅ **建議**：在筆記內容中加入 frontmatter 或版本區塊
- ✅ **格式**：
  ```markdown
  ---
  original_id: djWYXG-hQHuHKZaqgVNxPg
  version: v2
  updated_at: 2025-11-05 12:00:00
  ---
  
  # 原始內容...
  ```

---

## 🔧 router 服務規格

### 必要功能

```typescript
// 創建筆記端點
POST /create-hedgedoc-note
Request Body: {
  "content": "Markdown 內容",
  "hedgedoc_url": "HedgeDoc 實例 URL"
}
Response: {
  "success": true,
  "note_url": "https://hedgedoc.../NOTE_ID",
  "note_id": "NOTE_ID"
}
```

### router 實現邏輯

```javascript
app.post('/create-hedgedoc-note', async (req, res) => {
  const { content, hedgedoc_url } = req.body;
  
  try {
    const response = await fetch(`${hedgedoc_url}/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/markdown'
      },
      body: content,
      redirect: 'manual'  // 不自動跟隨重定向
    });
    
    if (response.status === 302) {
      const noteUrl = response.headers.get('location');
      const noteId = noteUrl.split('/').pop();
      
      res.json({
        success: true,
        note_url: noteUrl,
        note_id: noteId
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'HedgeDoc API 返回非預期狀態碼'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

---

## 📚 參考資料

### 測試實例

**最新驗證測試（2025-11-05）**：
- **測試筆記 1**：https://md.blocktempo.ai/43hzF0Y6R4u7VmcLrtn_5Q
- **編輯版本筆記**：https://md.blocktempo.ai/DQiIxRKyTZir_f3nJBoXRw
- **帶 Alias 筆記**：https://md.blocktempo.ai/test-alias-1762341481

**舊測試實例（已下線）**：
- ~~https://hedgedoc-production-bab4.up.railway.app/djWYXG-hQHuHKZaqgVNxPg~~
- ~~https://hedgedoc-production-bab4.up.railway.app/-BLLJ8t8SbOiDOqEnZBKqQ~~
- ~~https://hedgedoc-production-bab4.up.railway.app/gfaLm6jfSB-qS9WjpKq3nQ~~

### HedgeDoc API 限制

- **速率限制**：20 請求/時間窗口
- **版本**：1.10.3
- **支援的端點**：
  - ✅ POST /new（創建）
  - ✅ GET /:id/download（讀取）
  - ❌ PUT/PATCH（不支援直接編輯）
  - ❌ DELETE（不支援刪除）

---

## 🎬 快速開始

### 情境 1：我要創建一篇新筆記

```bash
# 終端機測試
curl -X POST https://md.blocktempo.ai/new \
  -H "Content-Type: text/markdown" \
  -d "# 我的新筆記

這是內容..." \
  -i
```

### 情境 2：我要在 n8n 中創建筆記

1. 設定 HTTP Request 節點連接到 router 服務
2. Body 設為 JSON 格式
3. 傳送 `{"content": "Markdown 內容"}`
4. 從回應中取得 `note_url`

### 情境 3：我要編輯現有筆記

1. GET /:id/download 讀取原內容
2. 在 Code 節點中修改內容
3. POST /new 創建新版本（透過 router）
4. 在新版本中記錄原始筆記 ID

---

## ⚠️ 重要提醒

1. **不要再嘗試直接用 n8n HTTP Request 調用 HedgeDoc**
   - 這已經證實不可行
   - 必須透過 router 中轉

2. **版本管理很重要**
   - 每次編輯都會創建新筆記
   - 務必記錄原始筆記 ID
   - 建議建立版本追蹤機制

3. **內存操作優於文件操作**
   - 不需要創建臨時文件
   - 適合容器化部署
   - 效能更好

4. **測試時注意速率限制**
   - 限制：20 請求/時間窗口
   - 避免頻繁測試導致被限制

---

---

## 📖 官方 API 端點完整參考

根據 [HedgeDoc 官方 API 文檔](https://docs.hedgedoc.org/dev/api/)，以下是所有可用的端點：

### Notes 端點

| 端點 | HTTP 方法 | 說明 | 驗證狀態 |
|-----|----------|-----|---------|
| `/new` | `GET` | 創建新筆記（隨機 ID，使用預設模板） | ✅ 官方支援 |
| `/new` | `POST` | 匯入 Markdown 到新筆記（需要 `Content-Type: text/markdown`） | ✅ 官方支援 + 已測試 |
| `/new/<ALIAS>` | `POST` | 創建帶指定 alias 的新筆記（需啟用 FreeURL 模式） | ✅ 官方支援 |
| `/<NOTE>/download` | `GET` | 返回筆記的原始 Markdown 內容 | ✅ 官方支援 + 已測試 |
| `/<NOTE>/publish` | `GET` | 重定向到筆記的發布版本 | ✅ 官方支援 |
| `/<NOTE>/slide` | `GET` | 重定向到筆記的投影片版本 | ✅ 官方支援 |
| `/<NOTE>/info` | `GET` | 返回筆記元數據（JSON 格式） | ✅ 官方支援 |
| `/<NOTE>/revision` | `GET` | 返回可用的筆記修訂版本列表 | ✅ 官方支援 |
| `/<NOTE>/revision/<REVISION-ID>` | `GET` | 返回指定修訂版本的內容 | ✅ 官方支援 |
| `/<NOTE>/gist` | `GET` | 創建 GitHub Gist（需配置 GitHub 整合） | ✅ 官方支援 |

### User / History 端點

| 端點 | HTTP 方法 | 說明 | 需要登入 |
|-----|----------|-----|---------|
| `/me` | `GET` | 返回當前用戶資料 | ✅ 是 |
| `/me/export` | `GET` | 匯出所有筆記為 zip | ✅ 是 |
| `/history` | `GET` | 返回最近查看的筆記列表 | ✅ 是 |
| `/history` | `POST` | 替換用戶歷史記錄 | ✅ 是 |
| `/history` | `DELETE` | 刪除用戶歷史記錄 | ✅ 是 |
| `/history/<NOTE>` | `POST` | 切換筆記的釘選狀態 | ✅ 是 |
| `/history/<NOTE>` | `DELETE` | 從歷史記錄中刪除筆記 | ✅ 是 |

### Server 端點

| 端點 | HTTP 方法 | 說明 | 驗證狀態 |
|-----|----------|-----|---------|
| `/status` | `GET` | 返回 HedgeDoc 實例狀態（JSON 格式） | ✅ 官方支援 |
| `/metrics` | `GET` | Prometheus 兼容的監控端點 | ✅ 官方支援（1.8+） |

### ❌ 不存在的端點

以下端點**不存在**於 HedgeDoc API：

- ❌ `PUT /<NOTE>` - 直接更新筆記內容（不支援）
- ❌ `PATCH /<NOTE>` - 部分更新筆記內容（不支援）
- ❌ `DELETE /<NOTE>` - 刪除筆記（不支援，需透過 Web UI）

**重要**：這就是為什麼編輯筆記必須使用「下載 → 修改 → 創建新版本」的方法。

---

## 🔗 外部資源

- **官方 API 文檔**：https://docs.hedgedoc.org/dev/api/
- **OpenAPI 規格**：https://docs.hedgedoc.org/dev/openapi.yml
- **HedgeDoc GitHub**：https://github.com/hedgedoc/hedgedoc
- **配置文檔**：https://docs.hedgedoc.org/configuration/

---

**最後更新**：2025-11-05  
**驗證狀態**：✅ 已對照官方文檔驗證（官方支援 + 過往測試成功）  
**測試環境**：原測試實例已下線，但方法符合官方規範  
**維護者**：請在修改時保持此文件的簡潔性和準確性

