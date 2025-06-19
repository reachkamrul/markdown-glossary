import { defineConfig } from 'vitepress';
import { markdownGlossaryPlugin } from 'vitepress-plugin-glossary';
import glossary from './glossary.json';

export default {
  title: ' ',
  titleTemplate: ':title - FluentCart Documentation',
  description: 'Comprehensive documentation for FluentCart - your all-in-one e-commerce solution.',
  base: '/',
  markdown: {
    config: (md) => {
      md.use(markdownGlossaryPlugin, {
        glossary: glossary,
        firstOccurrenceOnly: true
      });
    }
  },
  themeConfig: {
    logo: {
      dark: '/logo-markdown.png',
      light: '/logo-markdown.png',
    },
  },
}
