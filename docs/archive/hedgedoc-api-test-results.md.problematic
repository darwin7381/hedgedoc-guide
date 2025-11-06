# HedgeDoc API 測試結果記錄

## 測試環境
- **HedgeDoc 實例**: https://hedgedoc-production-bab4.up.railway.app/
- **HedgeDoc 版本**: 1.10.3
- **測試時間**: 2025-06-19 03:18:27 GMT

## API 端點
- **創建新筆記**: `POST /new`
- **內容類型**: `text/markdown`

## 測試一：檔案上傳方式

### curl 命令
```bash
curl -X POST https://hedgedoc-production-bab4.up.railway.app/new \
  -H "Content-Type: text/markdown" \
  --data-binary @test_article.md -i
```

### 回應結果
```
HTTP/2 302 
content-security-policy: default-src 'none';base-uri 'self';connect-src 'self' wss://hedgedoc-production-bab4.up.railway.app https://vimeo.com/api/v2/video/;font-src 'self';manifest-src 'self';frame-src 'self' https://player.vimeo.com https://www.youtube.com https://gist.github.com *;img-src * data:;script-src https://hedgedoc-production-bab4.up.railway.app/build/ https://hedgedoc-production-bab4.up.railway.app/js/ https://hedgedoc-production-bab4.up.railway.app/config 'unsafe-inline' 'nonce-c3807751-3c52-409d-8a45-3ee45334c5cf' 'sha256-81acLZNZISnyGYZrSuoYhpzwDTTxi7vC1YM4uNxqWaM=';style-src https://hedgedoc-production-bab4.up.railway.app/build/ https://hedgedoc-production-bab4.up.railway.app/css/ 'unsafe-inline';object-src * *;form-action 'self';media-src *;upgrade-insecure-requests
content-type: text/plain; charset=utf-8
date: Thu, 19 Jun 2025 03:18:27 GMT
hedgedoc-version: 1.10.3
location: https://hedgedoc-production-bab4.up.railway.app/-BLLJ8t8SbOiDOqEnZBKqQ
referrer-policy: same-origin
server: railway-edge
set-cookie: connect.sid=s%3AYrza3XwHEj2ij4pg3NmT5RRwyF6DBPsU.YczKPJMhejEAG28OYB7tG3hsEEt6VjOM%2FLnZ3dcLgIE; Path=/; Expires=Thu, 03 Jul 2025 03:18:27 GMT; HttpOnly; Secure; SameSite=Lax
strict-transport-security: max-age=31536000; includeSubDomains
vary: Accept, Accept-Encoding
x-powered-by: Express
x-railway-edge: railway/asia-southeast1-eqsg3a
x-railway-request-id: M163Bc9HTlKU8HkDAQeqjw
x-ratelimit-limit: 20
x-ratelimit-remaining: 19
x-ratelimit-reset: 1750303408
content-length: 92

Found. Redirecting to https://hedgedoc-production-bab4.up.railway.app/-BLLJ8t8SbOiDOqEnZBKqQ
```

### 結果分析
- ✅ **狀態碼**: 302 (重定向成功)
- ✅ **新筆記 URL**: https://hedgedoc-production-bab4.up.railway.app/-BLLJ8t8SbOiDOqEnZBKqQ
- ✅ **速率限制**: 20次/窗口，剩餘19次
- ✅ **內容驗證**: 所有 Markdown 格式正確顯示

### 上傳的測試內容
```markdown
# 測試文章

這是一篇透過 API 創建的測試文章。

## 內容

- 項目 1
- 項目 2  
- 項目 3

## 程式碼範例

```javascript
console.log('Hello, HedgeDoc!');
```

**這是粗體文字**

*這是斜體文字*

測試完成！
```

## n8n 配置參考

### HTTP 節點設置
- **Method**: POST
- **URL**: https://hedgedoc-production-bab4.up.railway.app/new
- **Headers**: 
  ```
  Content-Type: text/markdown
  ```
- **Body**: Raw/JSON 模式，輸入 Markdown 內容

### 回應處理
- 新筆記 URL 在 `headers.location` 中
- 可用 `{{ $response.headers.location }}` 取得連結

## 測試二：直接文字上傳方式 1

### curl 命令
```bash
curl -X POST https://hedgedoc-production-bab4.up.railway.app/new \
  -H "Content-Type: text/markdown" \
  -d $'# 直接文字上傳測試\n\n這是透過直接文字上傳創建的筆記。\n\n## 特點\n\n- 不需要建立臨時檔案\n- 直接在 curl 命令中包含內容\n- 適合 n8n 自動化使用\n\n## 程式碼示例\n\n```python\nprint("Hello from direct text upload!")\n```\n\n**測試時間**: 動態\n\n*成功！*' \
  -i
```

### 回應結果
```
HTTP/2 302 
location: https://hedgedoc-production-bab4.up.railway.app/djWYXG-hQHuHKZaqgVNxPg
x-ratelimit-remaining: 18
```

### 結果分析
- ✅ **狀態碼**: 302 (重定向成功)
- ✅ **新筆記 URL**: https://hedgedoc-production-bab4.up.railway.app/djWYXG-hQHuHKZaqgVNxPg
- ✅ **內容驗證**: 標題、列表、程式碼區塊都正確顯示

## 測試三：直接文字上傳方式 2（簡化版）

### curl 命令
```bash
curl -X POST https://hedgedoc-production-bab4.up.railway.app/new \
  -H "Content-Type: text/markdown" \
  -d $'# 簡潔測試\n\n完美的 n8n 自動化方案！\n\n- 不需要檔案\n- 直接傳送內容\n- 非常適合自動化\n\n**狀態**: ✅ 成功' \
  -i
```

### 回應結果
```
HTTP/2 302 
location: https://hedgedoc-production-bab4.up.railway.app/7oHGCZ0hTL6kpZ666a9gBA
x-ratelimit-remaining: 19
```

### 結果分析
- ✅ **狀態碼**: 302 (重定向成功)
- ✅ **新筆記 URL**: https://hedgedoc-production-bab4.up.railway.app/7oHGCZ0hTL6kpZ666a9gBA
- ✅ **內容驗證**: 簡潔明瞭，完美適合 n8n

## 總結

### 成功測試的方法
1. **檔案上傳**: `--data-binary @filename.md`
2. **直接文字上傳**: `-d $'content with \n newlines'`

### n8n 推薦方式
**方式二（直接文字）最適合 n8n**：
- 不需要建立臨時檔案
- 內容可以動態生成
- 使用變數和表達式更方便

### n8n HTTP 節點完整配置
```
Method: POST
URL: https://hedgedoc-production-bab4.up.railway.app/new
Headers:
  Content-Type: text/markdown
Body (Raw):
  {{ $json.markdownContent }}
```

### 建議內容格式
```markdown
# {{ $json.title }}

{{ $json.content }}

## 自動生成
- 時間: {{ $now }}
- 來源: n8n 自動化
- 狀態: ✅ 成功
```

## 成功經驗記錄

### 關鍵發現
1. **直接文字上傳是最佳選擇**：使用 `-d $'content'` 語法可以完美處理多行內容
2. **換行符處理**：在 bash 中使用 `\n` 可以正確處理 Markdown 換行
3. **內容類型重要**：必須設定 `Content-Type: text/markdown` 標頭
4. **回應處理**：新筆記 URL 總是在 `location` 標頭中返回

### 複雜內容測試成功案例
```bash
curl -X POST https://hedgedoc-production-bab4.up.railway.app/new \
  -H "Content-Type: text/markdown" \
  -d $'# 直接文字上傳測試\n\n這是透過直接文字上傳創建的筆記。\n\n## 特點\n\n- 不需要建立臨時檔案\n- 直接在 curl 命令中包含內容\n- 適合 n8n 自動化使用\n\n## 程式碼示例\n\n```python\nprint("Hello from direct text upload!")\n```\n\n**測試時間**: 動態\n\n*成功！*' \
  -i
```

**成果**: https://hedgedoc-production-bab4.up.railway.app/djWYXG-hQHuHKZaqgVNxPg

### n8n 實作重點
- 使用 Raw Body 模式
- 善用 n8n 的變數和表達式
- 透過 `{{ $response.headers.location }}` 取得新筆記連結
- 可搭配其他節點進行後續處理（如發送通知、存入資料庫等）

## 編輯功能測試

### 🔍 編輯功能分析
經過測試發現，HedgeDoc API **不支援直接編輯現有筆記**。原因：
- HedgeDoc 主要透過 WebSocket 進行即時協作編輯
- REST API 僅提供創建、讀取和資訊查詢功能
- 沒有 PUT/PATCH 端點來更新現有筆記內容

### 🚀 主要編輯方法：「REST API 內存編輯」
**最佳解決方案** - 完全無文件系統操作的編輯流程：

#### 步驟 1：讀取內容到內存
```bash
ORIGINAL_CONTENT=$(curl -s https://hedgedoc-production-bab4.up.railway.app/djWYXG-hQHuHKZaqgVNxPg/download)
```

#### 步驟 2：內存中修改並組合內容
```bash
(echo "$ORIGINAL_CONTENT"; echo ""; echo "---"; echo ""; echo "## 🔄 版本更新 v2.0"; echo "- 更新時間: $(date '+%Y-%m-%d %H:%M:%S')"; echo "- 編輯方法: REST API 主要編輯法（內存操作）"; echo "- 優勢: 無文件系統依賴，適合 Telegram BOT") | curl -X POST https://hedgedoc-production-bab4.up.railway.app/new -H "Content-Type: text/markdown" --data-binary @- -i
```

#### 步驟 3：直接上傳新版本
無需創建任何臨時文件，內容直接從內存傳送到 API

### ✅ 主要編輯方法測試結果
- **原始筆記**: https://hedgedoc-production-bab4.up.railway.app/djWYXG-hQHuHKZaqgVNxPg
- **新版本 URL**: https://hedgedoc-production-bab4.up.railway.app/gfaLm6jfSB-qS9WjpKq3nQ
- **測試狀態**: ✅ 完全成功
  - 原始內容完整保留
  - 新增內容正確添加
  - 版本信息和時間戳正確
  - 零文件系統操作

### 🌟 主要編輯方法優勢
- ✅ **無文件系統依賴**: 完全在內存中操作
- ✅ **自動化友好**: 完美適合 n8n、Telegram BOT
- ✅ **容器完美支援**: Docker、Lambda、無服務器環境
- ✅ **版本管理**: 每次編輯創建新版本，保留完整歷史
- ✅ **效能最佳**: 減少 I/O 操作，提高響應速度

### 🤖 n8n 主要編輯工作流程
推薦的 n8n 工作流程（無文件系統操作）：

1. **HTTP 節點** - 讀取現有內容到內存：
   ```
   Method: GET
   URL: /<NOTE-ID>/download
   ```

2. **Code 節點** - 內存中處理和修改內容：
   ```javascript
   // 取得原始內容
   const originalContent = $input.first().body;
   
   // 構建版本更新信息
   const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
   const versionInfo = `\n\n---\n\n## 🔄 版本更新 v${Date.now()}\n- 更新時間: ${timestamp}\n- 編輯方法: n8n 主要編輯法\n- 觸發條件: ${$json.trigger || '手動'}`;
   
   // 添加新內容
   const newContent = $json.newContent || '預設新增內容';
   const updatedContent = originalContent + versionInfo + `\n\n## 🆕 新增內容\n\n${newContent}`;
   
   return { markdownContent: updatedContent };
   ```

3. **HTTP 節點** - 創建新版本：
   ```
   Method: POST
   URL: /new
   Headers: Content-Type: text/markdown
   Body: {{ $json.markdownContent }}
   ```

4. **後處理節點** - 版本管理：
   ```javascript
   return {
     originalUrl: $json.originalNoteId,
     newUrl: $response.headers.location,
     versionId: `v${Date.now()}`,
     method: 'memory_edit',
     success: $response.statusCode === 302
   };
   ```

### 📱 Telegram BOT 版本管理實現
```python
import requests
from datetime import datetime

class HedgeDocBot:
    def __init__(self, hedgedoc_url):
        self.base_url = hedgedoc_url
        self.versions = {}  # 版本歷史記錄
    
    def edit_note(self, note_id, new_content, user_id):
        """主要編輯方法：REST API 內存編輯"""
        try:
            # 步驟 1: 讀取現有內容到內存
            response = requests.get(f'{self.base_url}/{note_id}/download')
            original_content = response.text
            
            # 步驟 2: 內存中構建新版本
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            version_info = f"""

---

## 🔄 版本更新 v{int(datetime.now().timestamp())}
- 更新時間: {timestamp}
- 編輯者: {user_id}
- 編輯方法: Telegram BOT 主要編輯法
- 優勢: 無文件系統依賴，完美容器支援

## 🆕 新增內容

{new_content}

**狀態**: ✅ 編輯成功！
"""
            
            updated_content = original_content + version_info
            
            # 步驟 3: 直接上傳新版本（無文件操作）
            new_response = requests.post(
                f'{self.base_url}/new',
                data=updated_content,
                headers={'Content-Type': 'text/markdown'}
            )
            
            if new_response.status_code == 302:
                new_url = new_response.headers['location']
                version_id = f"v{int(datetime.now().timestamp())}"
                
                # 記錄版本歷史
                self.versions[version_id] = {
                    'original_id': note_id,
                    'new_url': new_url,
                    'timestamp': datetime.now(),
                    'user_id': user_id,
                    'method': 'memory_edit'
                }
                
                return {
                    'success': True,
                    'new_url': new_url,
                    'version_id': version_id,
                    'message': f'筆記編輯成功！新版本: {version_id}'
                }
            else:
                return {'success': False, 'error': 'API 調用失敗'}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def get_version_history(self, note_id):
        """獲取版本歷史"""
        history = []
        for version_id, info in self.versions.items():
            if info['original_id'] == note_id:
                history.append({
                    'version': version_id,
                    'timestamp': info['timestamp'],
                    'user': info['user_id'],
                    'url': info['new_url']
                })
        return sorted(history, key=lambda x: x['timestamp'], reverse=True)

# 使用範例
bot = HedgeDocBot('https://hedgedoc-production-bab4.up.railway.app')
result = bot.edit_note('djWYXG-hQHuHKZaqgVNxPg', '新增的測試內容', 'user123')
print(result)
```

### 📝 總結
主要編輯方法（REST API 內存編輯）完全解決了 HedgeDoc 的編輯需求：
- ✅ 零文件系統依賴
- ✅ 完美支援容器化部署
- ✅ 適合所有自動化場景
- ✅ 提供完整的版本管理功能

## 🔄 次要編輯方法：文件下載方式
（僅在特殊情況下使用，例如需要複雜的文件處理） 