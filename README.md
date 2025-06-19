# VitePress Plugin Glossary

A VitePress plugin that automatically identifies and links glossary terms with interactive tooltips.

![Version](https://img.shields.io/npm/v/vitepress-plugin-glossary)
![License](https://img.shields.io/npm/l/vitepress-plugin-glossary)
![Downloads](https://img.shields.io/npm/dm/vitepress-plugin-glossary)

## Features

- 🔍 Automatically detects and links glossary terms in your markdown content
- 🎯 Option to link only the first occurrence of each term per page
- 🎨 Beautiful, customizable tooltips using Vue components
- 🚫 Ability to skip terms using //double slashes//
- 📦 Support for both file-based and direct object glossaries
- 🔧 TypeScript support
- 🎉 Zero configuration required

## Quick Start

```bash
npm install vitepress-plugin-glossary
```

```typescript
// .vitepress/config.mts
import { defineConfig } from 'vitepress';
import { markdownGlossaryPlugin } from 'vitepress-plugin-glossary';
import glossary from './glossary.json';

export default defineConfig({
  markdown: {
    config: (md) => {
      md.use(markdownGlossaryPlugin, {
        glossary: glossary,
        firstOccurrenceOnly: true
      });
    }
  }
});
```

```javascript
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme';
import GlossaryTooltip from 'vitepress-plugin-glossary/vue';

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.component('GlossaryTooltip', GlossaryTooltip);
    }
};
```

## Documentation

For detailed setup instructions and configuration options, see:
- [Installation Guide](INSTALLATION.md)

## Example

```json
// glossary.json
{
  "VitePress": "A Static Site Generator powered by Vite and Vue",
  "Vue": "A Progressive JavaScript Framework"
}
```

```markdown
// Your markdown content
VitePress is built with Vue.

To prevent linking: //VitePress//
```

## Requirements

- Node.js 16 or higher
- VitePress 1.0.0 or higher
- Vue 3.3.0 or higher

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details