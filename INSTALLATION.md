# Installation Guide

## Prerequisites

- Node.js 16 or higher
- VitePress 1.0.0 or higher
- Vue 3.3.0 or higher

## Installation

```bash
npm install vitepress-plugin-glossary
```

## Configuration

### 1. VitePress Config

Add the plugin to your VitePress configuration file (`.vitepress/config.mts`):

```typescript
import { defineConfig } from 'vitepress';
import { markdownGlossaryPlugin } from 'vitepress-plugin-glossary';

// Option 1: Using a direct glossary object
import glossary from './glossary.json';

// Option 2: Using a file path
const glossaryPath = './.vitepress/glossary.json';

export default defineConfig({
  markdown: {
    config: (md) => {
      // Option 1: Using direct glossary object
      md.use(markdownGlossaryPlugin, {
        glossary: glossary,
        firstOccurrenceOnly: true // optional
      });

      // OR Option 2: Using file path
      md.use(markdownGlossaryPlugin, {
        glossaryPath: glossaryPath,
        firstOccurrenceOnly: true // optional
      });
    }
  }
});
```

### 2. Theme Configuration

Add the plugin to your VitePress theme configuration file (`.vitepress/theme/index.js`):

```javascript
import DefaultTheme from 'vitepress/theme';
import GlossaryTooltip from 'vitepress-plugin-glossary/vue';

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.component('GlossaryTooltip', GlossaryTooltip);
    }
};
```

## Glossary File Format

Create a glossary.json file with your terms and definitions:

```json
{
  "VitePress": "A Static Site Generator powered by Vite and Vue",
  "Vue": "A Progressive JavaScript Framework",
  "Markdown": "A lightweight markup language"
}
```

## Plugin Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `glossary` | `Record<string, string>` | `undefined` | Direct glossary object where keys are terms and values are definitions |
| `glossaryPath` | `string` | `./.vitepress/glossary.json` | Path to the glossary JSON file |
| `firstOccurrenceOnly` | `boolean` | `false` | If true, only the first occurrence of each term per page will be linked |

Note: If both `glossary` and `glossaryPath` are provided, `glossary` takes precedence.

## Usage in Markdown

Terms from your glossary will be automatically detected and linked with tooltips:

```markdown
VitePress is a great tool for documentation.

To skip linking a term, use double slashes: //VitePress//
```

## Styling

The plugin adds the following CSS classes that you can customize:

- `.glossary-term`: The term that has a tooltip
- `.glossary-tooltip`: The tooltip container
- `.no-glossary`: Terms wrapped in //double slashes// that should not be linked 