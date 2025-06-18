import { defineConfig } from 'vitepress';
import { markdownGlossaryPlugin } from './plugins/markdown-glossary.js';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VitePress Plugin",
  description: "A VitePress Site",
  // Configure Markdown-it
  markdown: {
    config: (md) => {
      md.use(markdownGlossaryPlugin);  // Apply glossary plugin
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
