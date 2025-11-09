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
- ✅ 讀取筆記內容和元數據

---

## 📖 完整使用指南

👉 **[docs/01-guide/1.2-n8n-workflow-template-guide.md](../docs/01-guide/1.2-n8n-workflow-template-guide.md)**

包含：
- ✅ 詳細的匯入步驟（3 種方法）
- ✅ Token 設置說明
- ✅ 每個節點的詳細配置
- ✅ 輸出的 URLs 完整說明
- ✅ 自定義範本方法
- ✅ 實戰應用場景（4 個完整範例）
- ✅ 常見錯誤解決（6 種錯誤）
- ✅ 疑難雜症排查（Debug 步驟）
- ✅ 進階技巧（動態 Alias、批次處理等）
- ✅ 完整的節點設置參考

---

## ⚡ 快速開始

```bash
# 1. 下載範本
curl -o hedgedoc-workflow.json \
  https://raw.githubusercontent.com/darwin7381/hedgedoc-guide/main/workflows/hedgedoc-create-and-read-template.json

# 2. 在 n8n 中匯入（Import from File）
# 3. 修改 Token
# 4. 執行測試
```

---

**完整說明請查看**：[docs/01-guide/1.2-n8n-workflow-template-guide.md](../docs/01-guide/1.2-n8n-workflow-template-guide.md)
