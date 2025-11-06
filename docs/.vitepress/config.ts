import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/docs/',  // 所有資源和連結都會是 /docs/ 開頭，這樣 Worker 才能正確攔截
  title: 'HedgeDoc 測試文檔',
  description: 'HedgeDoc API 測試與整合指南',
  
  // 忽略 dead links，避免建置失敗
  ignoreDeadLinks: true,
  
  // 清理 URL，移除 .html 後綴
  cleanUrls: true,
  
  // 主題配置
  themeConfig: {
    // 導航欄（不需要 /docs/ 前綴，base 會自動加）
    nav: [
      { text: '首頁', link: '/' },
      { text: '使用指南', link: '/guide/' },
      { text: 'API 參考', link: '/api-reference/' },
      { text: '部署指南', link: '/deployment/' },
      { text: '故障排查', link: '/troubleshooting/' }
    ],
    
    // 側邊欄 - 結構化配置（不需要 /docs/ 前綴）
    sidebar: {
      '/guide/': [
        {
          text: '使用指南',
          items: [
            { text: '概述', link: '/guide/' },
            { text: '標準操作指南', link: '/guide/standard-operation-guide' }
          ]
        }
      ],
      '/api-reference/': [
        {
          text: 'API 參考',
          items: [
            { text: '概述', link: '/api-reference/' },
            { text: '驗證報告', link: '/api-reference/verification-report' }
          ]
        }
      ],
      '/deployment/': [
        {
          text: '部署指南',
          items: [
            { text: '概述', link: '/deployment/' },
            { text: 'VitePress 設置', link: '/deployment/vitepress-setup' },
            { text: 'GitHub & Railway', link: '/deployment/github-railway' },
            { text: 'Cloudflare Worker', link: '/deployment/cloudflare-worker' }
          ]
        }
      ],
      '/troubleshooting/': [
        {
          text: '故障排查',
          items: [
            { text: '概述', link: '/troubleshooting/' },
            { text: '失敗嘗試歸檔', link: '/troubleshooting/failed-attempts' },
            { text: '測試文件總結', link: '/troubleshooting/test-files-summary' },
            { text: '專案重組記錄', link: '/troubleshooting/project-reorganization' }
          ]
        }
      ],
      '/archive/': [
        {
          text: '歷史歸檔',
          items: [
            { text: '概述', link: '/archive/' },
            { text: 'API 方法比較', link: '/archive/hedgedoc-api-methods-comparison' },
            { text: 'API 測試結果', link: '/archive/hedgedoc-api-test-results' },
            { text: 'n8n 整合錯誤', link: '/archive/hedgedoc-n8n-integration-errors' },
            { text: 'HashKey Pro 新聞', link: '/archive/hashkey-pro-news' },
            { text: 'Markdown 測試', link: '/archive/markdown-test-complete' }
          ]
        }
      ]
    },
    
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

