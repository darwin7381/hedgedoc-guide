import { defineConfig } from 'vitepress'
import { readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 自動掃描 docs 目錄生成側邊欄
function generateSidebar() {
  const docsDir = join(__dirname, '..')
  const items: any[] = []
  
  // 掃描根目錄的 markdown 文件
  const rootFiles = readdirSync(docsDir)
    .filter(file => file.endsWith('.md') && file !== 'index.md')
    .map(file => ({
      text: file.replace('.md', '').replace(/-/g, ' '),
      link: `/${file.replace('.md', '')}`
    }))
  
  if (rootFiles.length > 0) {
    items.push({
      text: '文檔',
      items: rootFiles
    })
  }
  
  // 掃描子目錄
  const dirs = readdirSync(docsDir)
    .filter(item => {
      const fullPath = join(docsDir, item)
      return statSync(fullPath).isDirectory() && !item.startsWith('.')
    })
  
  dirs.forEach(dir => {
    const dirPath = join(docsDir, dir)
    const files = readdirSync(dirPath)
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        text: file.replace('.md', '').replace(/-/g, ' '),
        link: `/${dir}/${file.replace('.md', '')}`
      }))
    
    if (files.length > 0) {
      items.push({
        text: dir.charAt(0).toUpperCase() + dir.slice(1),
        collapsed: false,
        items: files
      })
    }
  })
  
  return items
}

export default defineConfig({
  title: 'HedgeDoc 測試文檔',
  description: 'HedgeDoc API 測試與整合指南',
  
  // 忽略 dead links，避免建置失敗
  ignoreDeadLinks: true,
  
  // 清理 URL，移除 .html 後綴
  cleanUrls: true,
  
  // 主題配置
  themeConfig: {
    // 導航欄
    nav: [
      { text: '首頁', link: '/' },
      { text: '標準操作指南', link: '/STANDARD-OPERATION-GUIDE' },
      { text: '專案重組摘要', link: '/PROJECT-REORGANIZATION-SUMMARY' }
    ],
    
    // 側邊欄 - 自動生成
    sidebar: generateSidebar(),
    
    // 社交連結
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hedgedoc/hedgedoc' }
    ],
    
    // 搜索
    search: {
      provider: 'local'
    },
    
    // 頁腳
    footer: {
      message: 'HedgeDoc API 測試文檔',
      copyright: 'Copyright © 2025'
    },
    
    // 編輯連結
    editLink: {
      pattern: 'https://github.com/yourusername/test-hedgedoc/edit/main/docs/:path',
      text: '在 GitHub 上編輯此頁'
    },
    
    // 最後更新時間
    lastUpdated: {
      text: '最後更新',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'short'
      }
    }
  },
  
  // Markdown 配置
  markdown: {
    html: false,  // 官方正規方案：禁用 HTML 解析，防止 <NOTE> 等被誤判為 Vue 組件
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    config: (md) => {
      // 為所有包含 {{ 的內容區塊自動添加處理
      const defaultRender = md.render.bind(md)
      md.render = (src, env) => {
        // 將 {{ }} 暫時替換為安全的字符
        const safeSrc = src.replace(/\{\{([^}]+)\}\}/g, '&#123;&#123;$1&#125;&#125;')
        return defaultRender(safeSrc, env)
      }
    }
  }
})

