# HedgeDoc API 使用教學

## 測試環境
- **HedgeDoc 實例**: https://hedgedoc-production-bab4.up.railway.app/
- **API 限制**: 20 請求/時間窗口

---

## 一. 創建

### 主要方法：文字直接配 body 的做法

直接在 HTTP 請求 body 中包含 Markdown 內容。

#### curl 範例
```bash
curl -X POST https://hedgedoc-production-bab4.up.railway.app/new \
  -H "Content-Type: text/markdown" \
  -d "# 我的文章標題

這是文章內容...

## 子標題
- 項目 1  
- 項目 2

**粗體文字** 和 *斜體文字*" \
  -i
```

#### n8n 正確配置

**方法一：Raw 模式（推薦）**
```
Method: POST
URL: https://hedgedoc-production-bab4.up.railway.app/new

Send Headers: ✅ 開啟
Headers:
  Name: Content-Type
  Value: text/markdown

Send Body: ✅ 開啟
Body Content Type: Raw  ← 選擇 Raw
Content Type: text/markdown  ← 手動輸入
Body: 
# 我的文章標題

這是文章內容...

## 子標題
- 項目 1
- 項目 2

**粗體文字** 和 *斜體文字*

Options > Response:
Include Response Headers and Status: ✅ 開啟
```

**方法二：JSON 模式（✅ 已驗證可行）**
```
Method: POST
URL: https://hedgedoc-production-bab4.up.railway.app/new

Send Headers: ✅ 開啟
Headers:
  Name: Content-Type
  Value: application/json  ← 改為 application/json

Send Body: ✅ 開啟
Body Content Type: JSON  ← 選擇 JSON
Body:
"# 我的文章標題\n\n這是文章內容...\n\n## 子標題\n- 項目 1\n- 項目 2\n\n**粗體文字** 和 *斜體文字*"

Options > Response:
Include Response Headers and Status: ✅ 開啟
```

**✅ JSON 方法測試成功**：
- 測試URL：https://hedgedoc-production-bab4.up.railway.app/Onsm4d96Qg-92cvQPWofEQ
- 狀態碼：302 重定向 ✅
- HedgeDoc 接受 JSON 字符串格式的 Markdown 內容

#### 測試結果
- **測試 URL**: https://hedgedoc-production-bab4.up.railway.app/djWYXG-hQHuHKZaqgVNxPg
- **狀態**: ✅ 成功

### 次要方法：檔案上傳方法

假設已有 Markdown 檔案，直接上傳檔案內容。

#### curl 範例
```bash
curl -X POST https://hedgedoc-production-bab4.up.railway.app/new \
  -H "Content-Type: text/markdown" \
  --data-binary @article.md \
  -i
```

#### n8n 配置（困難）
```
Method: POST
URL: https://hedgedoc-production-bab4.up.railway.app/new

Send Headers: ✅ 開啟
Headers:
  Content-Type: text/markdown

Send Body: ✅ 開啟
Body Content Type: Form-Data
Parameter Type: n8n Binary File
Name: file
Input Data Field Name: data

⚠️ 需要先從其他節點提供二進制檔案資料
```

#### 注意事項
- 需要先準備好 `article.md` 檔案
- n8n 中此方法較難實現，建議使用主要方法

#### 測試結果
- **測試 URL**: https://hedgedoc-production-bab4.up.railway.app/-BLLJ8t8SbOiDOqEnZBKqQ
- **狀態**: ✅ 成功

---

## 二. 修改

### 下載並閱讀，然後創建一個新的

HedgeDoc API 不支援直接修改，只能下載原內容→修改→創建新版本。

#### curl 範例

**步驟 1：下載現有內容**
```bash
curl -s https://hedgedoc-production-bab4.up.railway.app/djWYXG-hQHuHKZaqgVNxPg/download
```

**步驟 2：創建新版本（包含原內容+新內容）**
```bash
curl -X POST https://hedgedoc-production-bab4.up.railway.app/new \
  -H "Content-Type: text/markdown" \
  -d "$(curl -s https://hedgedoc-production-bab4.up.railway.app/djWYXG-hQHuHKZaqgVNxPg/download)

---

## 🔄 版本更新
- 更新時間: 2025-06-19 12:00:00
- 修改方式: 下載→修改→重新創建

## 🆕 新增內容
這是新增的內容...

**狀態**: ✅ 修改完成" \
  -i
```

#### n8n 修改工作流程

**節點 1：下載原內容**
```
Method: GET
URL: https://hedgedoc-production-bab4.up.railway.app/djWYXG-hQHuHKZaqgVNxPg/download
```

**節點 2：創建新版本**

**Raw 模式**：
```
Method: POST
URL: https://hedgedoc-production-bab4.up.railway.app/new

Send Headers: ✅ 開啟
Headers:
  Name: Content-Type
  Value: text/markdown

Send Body: ✅ 開啟
Body Content Type: Raw
Content Type: text/markdown
Body: 
{{ $('HTTP Request').first().body }}

---

## 🔄 版本更新
- 更新時間: {{ $now }}
- 修改方式: n8n 自動化

## 🆕 新增內容
這是新增的內容...

**狀態**: ✅ 修改完成
```

**JSON 模式**（推薦）：
```
Method: POST
URL: https://hedgedoc-production-bab4.up.railway.app/new

Send Headers: ✅ 開啟
Headers:
  Name: Content-Type
  Value: application/json

Send Body: ✅ 開啟
Body Content Type: JSON
Body: 
"{{ $('HTTP Request').first().body.replace(/\n/g, '\\n').replace(/"/g, '\\"') }}\n\n---\n\n## 🔄 版本更新\n- 更新時間: {{ $now }}\n- 修改方式: n8n 自動化\n\n## 🆕 新增內容\n這是新增的內容...\n\n**狀態**: ✅ 修改完成"

Options > Response:
Include Response Headers and Status: ✅ 開啟
```

#### 測試結果
- **原始筆記**: https://hedgedoc-production-bab4.up.railway.app/djWYXG-hQHuHKZaqgVNxPg
- **修改版本**: https://hedgedoc-production-bab4.up.railway.app/gfaLm6jfSB-qS9WjpKq3nQ
- **狀態**: ✅ 成功保留原內容並添加新內容

---

## ⚠️ n8n 重要設定

### 常見錯誤
如果配置錯誤，會收到 200 狀態碼的 HTML 頁面而非 302 重定向：

#### ❌ 錯誤配置範例
```
Body Content Type: Raw
Content Type: text/markdown  
Body: 0  ← 內容未正確填入

或者：
Body Content Type: JSON
Content Type: application/json
Body: (空白)  ← 內容是空的

或者：
Body Content Type: JSON
Content Type: text/markdown  ← 錯誤！JSON模式應該用application/json
Body: "內容..."
```

#### ❌ 錯誤的回應內容（就像您收到的）
```json
[
  {
    "data": " <!DOCTYPE html>\n<html>\n<head>..."
  }
]
```

#### ✅ 正確配置
```
Send Body: ✅ 必須開啟
Body Content Type: Raw/Custom  ← 關鍵修正！選擇 Raw/Custom 不是 Raw
Content Type: text/markdown
Body: 實際的 Markdown 內容

例如：
# 測試標題

這是測試內容...

## 子標題
- 項目 1
- 項目 2
```

#### 🔧 配置步驟詳解
1. **Method**: POST
2. **URL**: https://hedgedoc-production-bab4.up.railway.app/new
3. **Send Headers**: ✅ 勾選
4. **Headers**: 
   - Name: `Content-Type`
   - Value: `text/markdown`
5. **Send Body**: ✅ 勾選
6. **Body Content Type**: 選擇 `Raw/Custom`（不是 `Raw`）
7. **Content Type**: 輸入 `text/markdown`
8. **Body**: 直接貼入您的 Markdown 內容

#### ✅ 正確的回應內容
```
狀態碼: 302
Headers: 
  location: https://hedgedoc-production-bab4.up.railway.app/XXXXXX
```

### 成功標誌
- **狀態碼**: 302 (重定向)
- **新筆記 URL**: 在回應的 `headers.location` 中
- **錯誤狀態碼**: 200 + HTML 頁面 = 配置錯誤

### 故障排除步驟
1. **推薦**：嘗試 JSON 模式
   - `Body Content Type`: 選擇 `JSON`
   - `Content-Type` Header: `application/json`
   - `Body`: `"# 測試\n\n這是測試內容"`

2. **備用**：嘗試 Raw 模式
   - `Body Content Type`: 選擇 `Raw`
   - `Content-Type`: 手動輸入 `text/markdown`
   - `Body`: 直接貼入 Markdown 內容

3. 檢查 `Send Body` 是否開啟
4. 檢查 `Body` 欄位是否有實際內容（不是 0 或空白）
5. 確認收到 302 狀態碼（不是 200 + HTML）

### 🎯 解決您的問題
如果您一直收到 HTML 頁面而不是 302 重定向，**請嘗試以下方法**：

**推薦解決方案：JSON 模式**
1. `Body Content Type`: 選擇 `JSON`
2. `Content-Type` Header: 設為 `application/json`
3. `Body`: 將 Markdown 內容用雙引號包裝成字符串
4. 換行符用 `\n` 表示，例如：`"# 標題\n\n內容..."`

**備用方案：Raw 模式**
1. `Body Content Type`: 選擇 `Raw`
2. `Content-Type`: 手動輸入 `text/markdown`
3. `Body`: 直接貼入 Markdown 內容

**✅ JSON 方法已驗證成功**，建議優先使用！

---

## 重要注意事項

### API 回應
- **狀態碼**: 302 重定向
- **新筆記 URL**: 在 `location` header 中
- **速率限制**: 20 請求/時間窗口

### 版本管理
- 每次修改實際上創建新筆記
- 建議在新版本中記錄原筆記 ID 