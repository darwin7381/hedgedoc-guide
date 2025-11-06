# HedgeDoc API 測試專案

> 本專案記錄了 HedgeDoc API 的測試過程，包括成功方案和失敗經驗

## 🎯 快速導航

### 我應該讀哪份文件？

| 情況 | 推薦文件 | 說明 |
|-----|---------|------|
| **我想知道正確的做法** | [`STANDARD-OPERATION-GUIDE.md`](./STANDARD-OPERATION-GUIDE.md) ⭐⭐⭐⭐⭐ | 開始從這裡！包含所有正確的操作方式 |
| **我想建立文檔站** | [`VITEPRESS-SETUP-GUIDE.md`](./VITEPRESS-SETUP-GUIDE.md) ⭐⭐⭐⭐⭐ | VitePress 完整設置指南與重要教訓 |
| **我想了解測試歷史** | [`TEST-FILES-SUMMARY.md`](./TEST-FILES-SUMMARY.md) | 完整的測試情況梳理和文件說明 |
| **我想看實際測試結果** | [`hedgedoc-api-test-results.md`](./hedgedoc-api-test-results.md) | 詳細的測試記錄和範例代碼 |
| **我想知道哪些方法不可行** | [`FAILED-ATTEMPTS-ARCHIVE.md`](./FAILED-ATTEMPTS-ARCHIVE.md) | 失敗嘗試記錄，避免重複錯誤 |
| **我需要測試用的 Markdown** | [`markdown-test-complete.md`](./markdown-test-complete.md) | 完整的 Markdown 語法測試樣本 |

---

## 🚀 快速開始

### 情境 1：我想用終端機測試 HedgeDoc API

```bash
# 創建新筆記
curl -X POST https://hedgedoc.example.com/new \
  -H "Content-Type: text/markdown" \
  -d "# 我的標題

這是內容..." \
  -i

# 預期結果：302 重定向，新筆記 URL 在 location header 中
```

➡️ **詳細說明**：[`STANDARD-OPERATION-GUIDE.md`](./STANDARD-OPERATION-GUIDE.md#1-創建新筆記標準方法)

---

### 情境 2：我想用 n8n 調用 HedgeDoc API

**⚠️ 重要**：n8n **無法直接**調用 HedgeDoc API，你需要一個 router 中轉服務。

**架構**：
```
n8n → router → HedgeDoc
```

**為什麼需要 router？**
- n8n HTTP Request 節點無法正確發送 `text/markdown` 格式
- 已測試所有可能的配置，全部失敗
- router 是標準且穩定的解決方案

➡️ **詳細說明**：[`STANDARD-OPERATION-GUIDE.md`](./STANDARD-OPERATION-GUIDE.md#-router-服務規格)

---

### 情境 3：我想編輯現有筆記

**⚠️ 重要**：HedgeDoc API **不支援直接編輯**

**標準做法**：下載 → 修改 → 創建新版本

```bash
# 1. 下載原內容
CONTENT=$(curl -s https://hedgedoc.../NOTE_ID/download)

# 2. 修改內容（在內存中）
UPDATED="$CONTENT

---

## 更新
- 時間: $(date)
- 新增內容: ..."

# 3. 創建新版本
echo "$UPDATED" | curl -X POST https://hedgedoc.../new \
  -H "Content-Type: text/markdown" \
  --data-binary @- \
  -i
```

➡️ **詳細說明**：[`STANDARD-OPERATION-GUIDE.md`](./STANDARD-OPERATION-GUIDE.md#3-編輯筆記標準方法)

---

## 📁 專案文件結構

```
test-hedgedoc/
├── README.md                              # 👈 你在這裡！專案入口
│
├── STANDARD-OPERATION-GUIDE.md            # ⭐ 標準操作指南（從這裡開始）
├── VERIFICATION-REPORT.md                 # ✅ 完整驗證報告（官方文檔+實測）
├── TEST-FILES-SUMMARY.md                  # 📊 測試情況總結
├── FAILED-ATTEMPTS-ARCHIVE.md             # ❌ 失敗嘗試記錄
├── PROJECT-REORGANIZATION-SUMMARY.md      # 📝 整理過程說明
│
├── markdown-test-complete.md              # 📝 Markdown 測試樣本
├── hashkey-pro-news.md                    # 📰 新聞文章測試樣本
│
└── archive/                               # 📦 歷史文件歸檔
    ├── README.md                          # 歸檔說明
    ├── hedgedoc-api-test-results.md       # 舊測試結果
    ├── hedgedoc-api-methods-comparison.md # 舊方法比較
    └── hedgedoc-n8n-integration-errors.md # 舊錯誤記錄
```

### 文件說明

#### 📌 主要文檔（必讀）

1. **`README.md`** 👈 你在這裡！
   - 專案入口和快速導航
   - 快速開始指南
   - 常見問題解答

2. **`STANDARD-OPERATION-GUIDE.md`** ⭐⭐⭐⭐⭐
   - 正確的標準操作方式
   - 已通過官方文檔驗證 + 終端機實測
   - 包含 curl 範例和 n8n 工作流程
   - **所有人應該從這裡開始**

3. **`VERIFICATION-REPORT.md`** ⭐⭐⭐⭐⭐
   - 完整的驗證報告
   - 官方文檔引用
   - 實際測試結果和命令
   - 測試筆記連結

#### 📚 參考文檔

4. **`TEST-FILES-SUMMARY.md`** ⭐⭐⭐⭐
   - 完整的測試情況梳理
   - 解釋測試歷史和問題根源
   - 說明為什麼需要 router

5. **`FAILED-ATTEMPTS-ARCHIVE.md`** ⭐⭐⭐
   - 記錄所有失敗的嘗試（17+ 種）
   - 避免重複錯誤
   - 理解為什麼某些方法不可行

6. **`PROJECT-REORGANIZATION-SUMMARY.md`** ⭐⭐⭐
   - 專案整理過程說明
   - 文件組織邏輯
   - 未來維護參考

#### 📝 測試樣本

7. **`markdown-test-complete.md`**
   - 包含所有 Markdown 語法的完整測試文檔
   - 用於測試 HedgeDoc 的渲染功能

8. **`hashkey-pro-news.md`**
   - 真實新聞文章樣本
   - 用於實際場景測試

#### 📦 歷史歸檔

9. **`archive/`** 資料夾
   - 存放過時的測試文件
   - 包含歸檔說明 README
   - **不建議新用戶閱讀**
   - 僅供歷史參考和學習經驗

---

## ⚡ 核心重點

### ✅ 可行的方法

1. **終端機 curl**
   - ✅ 可以直接創建筆記
   - ✅ 可以直接讀取筆記
   - ✅ 可以實現編輯（下載 → 修改 → 重新創建）

2. **n8n + router**
   - ✅ n8n 發送 JSON 到 router
   - ✅ router 轉換格式並轉發給 HedgeDoc
   - ✅ 穩定可靠的解決方案

3. **內存操作**
   - ✅ 不需要文件系統
   - ✅ 適合容器化環境
   - ✅ 效能更好

### ❌ 不可行的方法

1. **n8n 直接調用 HedgeDoc**
   - ❌ 無論如何配置都會失敗
   - ❌ 已測試 8+ 種配置組合
   - ❌ 不要再浪費時間嘗試

2. **在 n8n 中執行系統命令**
   - ❌ Execute Command 節點不存在
   - ❌ Code 節點有安全限制
   - ❌ 不是正規解決方案

3. **使用文件系統**
   - ❌ n8n Code 節點無法訪問
   - ❌ 容器環境不友好
   - ❌ 增加不必要的複雜度

---

## 🎓 關鍵經驗教訓

### 1. router 不是「臨時方案」
- ❌ 錯誤想法：「router 是因為 n8n 有 bug 才用的 workaround」
- ✅ 正確想法：「router 是標準的中間層架構，提供解耦和擴展性」

### 2. 承認工具的限制
- n8n HTTP Request 節點無法處理某些特殊情況
- 這不是 bug，可能是設計限制
- 接受限制，使用正確的架構方案

### 3. 記錄失敗和成功一樣重要
- 避免重複相同的錯誤
- 幫助團隊理解決策
- 節省未來的時間

---

## 📊 測試環境

- **HedgeDoc 實例**：https://hedgedoc.example.com
- **版本**：1.10.3
- **API 限制**：20 請求/時間窗口
- **驗證狀態**：✅ 已完成官方文檔驗證 + 終端機實測（2025-11-05）

### 成功測試的筆記（最新）

- https://hedgedoc.example.com/note-id（創建測試）
- https://hedgedoc.example.com/note-id（編輯測試）
- https://hedgedoc.example.com/note-id（Alias 測試）

**詳細驗證報告**：請參閱 [`VERIFICATION-REPORT.md`](./VERIFICATION-REPORT.md)

---

## 🔧 router 服務

### 基本規格

```typescript
POST /create-hedgedoc-note
Request: {
  "content": "Markdown 內容",
  "hedgedoc_url": "HedgeDoc 實例 URL"
}
Response: {
  "success": true,
  "note_url": "完整筆記 URL",
  "note_id": "筆記 ID"
}
```

### 實現範例

```javascript
app.post('/create-hedgedoc-note', async (req, res) => {
  const { content, hedgedoc_url } = req.body;
  
  const response = await fetch(`${hedgedoc_url}/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/markdown' },
    body: content,
    redirect: 'manual'
  });
  
  if (response.status === 302) {
    const noteUrl = response.headers.get('location');
    res.json({ success: true, note_url: noteUrl });
  } else {
    res.status(500).json({ success: false });
  }
});
```

➡️ **完整規格**：[`STANDARD-OPERATION-GUIDE.md`](./STANDARD-OPERATION-GUIDE.md#-router-服務規格)

---

## 📚 延伸閱讀

### HedgeDoc 文檔
- [HedgeDoc 官方文檔](https://docs.hedgedoc.org/)
- [HedgeDoc API（非官方）](https://hackmd.io/@hedgedoc/api)

### n8n 文檔
- [n8n HTTP Request 節點](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)
- [n8n Code 節點](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/)

---

## ❓ 常見問題

### Q: 為什麼 curl 可以但 n8n 不行？

A: n8n HTTP Request 節點在處理 `text/markdown` Content-Type 和 Body 的組合時有限制，無法像 curl 一樣正確發送請求。這不一定是 bug，可能是設計限制。

### Q: 我能不能不用 router？

A: 如果你只用終端機或自己寫程式，不需要 router。但如果你要在 n8n 中使用，router 是目前唯一可行的穩定方案。

### Q: router 會不會很複雜？

A: 不會！router 的核心代碼只需要 10-20 行。它只是接收 JSON，轉換格式，轉發給 HedgeDoc。

### Q: 我可以用其他方式嗎？

A: 請先閱讀 [`FAILED-ATTEMPTS-ARCHIVE.md`](./FAILED-ATTEMPTS-ARCHIVE.md)，了解哪些方法已經被證實不可行。不要浪費時間重複相同的錯誤。

### Q: HedgeDoc 支援編輯 API 嗎？

A: 不支援。HedgeDoc API 不提供 PUT/PATCH 端點。標準做法是下載原內容 → 修改 → 創建新版本。

---

## 🤝 貢獻

如果你發現了新的測試結果或方法：

1. **成功的方法** → 更新 `STANDARD-OPERATION-GUIDE.md`
2. **失敗的嘗試** → 添加到 `FAILED-ATTEMPTS-ARCHIVE.md`
3. **測試記錄** → 添加到 `hedgedoc-api-test-results.md`

---

## 📞 支援

如果有問題：

1. 先閱讀 [`STANDARD-OPERATION-GUIDE.md`](./STANDARD-OPERATION-GUIDE.md)
2. 檢查 [`FAILED-ATTEMPTS-ARCHIVE.md`](./FAILED-ATTEMPTS-ARCHIVE.md) 確認不是已知的失敗方法
3. 查看 [`TEST-FILES-SUMMARY.md`](./TEST-FILES-SUMMARY.md) 了解測試歷史

---

**最後更新**：2025-11-05  
**專案狀態**：✅ 已找到標準可行方案  
**維護者**：請保持文檔的準確性和簡潔性

