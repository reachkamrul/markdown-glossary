import { defineConfig } from 'vitepress';
import { markdownGlossaryPlugin } from 'vitepress-plugin-glossary';
import glossary from './glossary.json';

export default defineConfig({
  title: 'Glossary Plugin Example',
  description: 'Example usage of vitepress-plugin-glossary',
  markdown: {
    config: (md) => {
      md.use(markdownGlossaryPlugin, {
        glossary: glossary,
        firstOccurrenceOnly: true
      });
    }
  }
}); 