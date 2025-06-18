import { defineConfig } from 'vitepress';
import { markdownGlossaryPlugin } from './plugins/markdown-glossary.js';

export default {
  title: ' ',
  titleTemplate: ':title - FluentCart Documentation',
  description: 'Comprehensive documentation for FluentCart - your all-in-one e-commerce solution.',
  base: '/',
  markdown: {
    config: (md) => {
      md.use(markdownGlossaryPlugin);  // Apply glossary plugin
    }
  },
  themeConfig: {
    logo: {
      dark: '/logo-markdown.png',
      light: '/logo-markdown.png',
    },
  },
}
