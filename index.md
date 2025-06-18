---
title: Markdown Glossary Plugin
outline: 3
---

[//]: # (![Screenshot of Markdown]&#40;/screenshot.png&#41;)


# Markdown Glossary Plugin

The Markdown Glossary Plugin enhances your VitePress documentation by automatically identifying and linking key terms to their definitions. When a user hovers over a linked term, a short descriptive tooltip appears, providing immediate context without navigating away from the page. Additionally, it provides a clear mechanism to prevent specific instances of terms from being linked.

## Features

* Automatic Term Linking: Automatically identifies and links predefined glossary terms within your Markdown content.
* On-Hover Tooltips: Displays a concise definition as a tooltip when a user hooves over a linked term.
* Flexible Escaping: Allows specific instances of terms to be explicitly excluded from glossary linking using a simple `//term//` syntax.
* Centralized Glossary: All term definitions are managed in a single JSON file, making updates and maintenance straightforward.
* Customizable Appearance: Easily customize the look and feel of the linked terms and tooltips via CSS.

## Installation

To install and set up the Markdown Glossary Plugin, follow these steps. This involves adding specific files to your `.vitepress` directory and configuring your VitePress setup.

### 1. File Structure

Ensure your VitePress project has the following directory and file structure. Create any missing directories and files.
```
└── .vitepress/
├── config.js
├── theme/
│   ├── index.js
│   ├── components/
│   │   └── GlossaryTooltip.vue
│   └── custom.css
├── glossary.json
└── plugins/
└── markdown-glossary.js
```
### 2. Glossary Data (`.vitepress/glossary.json`)

This file holds all your glossary terms and their definitions. It's a simple JSON object where keys are the terms (case-sensitive) and values are their descriptions.

Create `.vitepress/glossary.json` with your terms:

```json
{
  "MRR": "Monthly Recurring Revenue.",
  "LTV": "LifeTime Value",
  "ARPU": "Average Revenue Per User.",
  "IPN": "Instant Payment Notification."
}
```

###  3. Vue Component
This Vue component renders the interactive glossary term and its tooltip.

Create or update `.vitepress/theme/components/GlossaryTooltip.vue`:

```vue
<template>
  <span
    class="glossary-term"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
    @focus="showTooltip = true"
    @blur="showTooltip = false"
    :aria-labelledby="tooltipId"
    tabindex="0"
  >
    <slot></slot>
    <transition name="fade">
      <div v-if="showTooltip" :id="tooltipId" class="glossary-tooltip" role="tooltip">
        {{ decodedDescription }}
      </div>
    </transition>
  </span>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  description: {
    type: String,
    required: true
  }
});

const showTooltip = ref(false);

const decodedDescription = computed(() => {
  try {
    return decodeURIComponent(props.description);
  } catch (e) {
    console.error('Error decoding glossary description:', e);
    return props.description;
  }
});

const tooltipId = computed(() => `glossary-tooltip-${Math.random().toString(36).substring(2, 9)}`);
</script>

<style scoped>
.glossary-term {
  position: relative;
  text-decoration: underline dotted;
  cursor: help;
  color: var(--vp-c-brand-1);
  padding-bottom: 1px;
  display: inline-block;
}

.glossary-tooltip {
  position: absolute;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-brand-1);
  padding: 8px 12px;
  border-radius: 6px;
  z-index: 1000;
  white-space: normal;
  max-width: 250px;
  box-shadow: var(--vp-shadow-3);
  top: auto;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -6px;
    border-width: 6px;
    border-style: solid;
    border-color: var(--vp-c-brand-1) transparent transparent transparent;
  }

  &.fade-enter-active,
  &.fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  &.fade-enter-from,
  &.fade-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(5px);
  }
}

@media (max-width: 768px) {
  .glossary-tooltip {
    max-width: 90vw;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>

```

### 4. Custom CSS 
   This file is for global custom styles, including potential styling for your glossary elements if needed.

Create or update `.vitepress/theme/custom.css`
```css
/* .vitepress/theme/custom.css */

/* Global styles for the Glossary Plugin */
/* You can add or override styles here */

/* Example: Styling for the span that escapes a glossary term */
.glossary-tooltip {
  /* font-size: 15px; */
  /* color: red; */
}

.no-glossary {
    /* text-decoration: none; */
    /* color: var(--vp-c-text-1); */
}
```
### 5. Markdown-Glossary Core 
   This is the core logic that transforms Markdown text, identifies terms, and injects the necessary HTML for glossary linking or escaping.

Create or update `.vitepress/plugins/markdown-glossary.js` with your working code:

```JavaScript
// .vitepress/plugins/markdown-glossary.js

import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import fs from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GLOSSARY_FILE_PATH = resolve(__dirname, '../glossary.json');

/**
 * Loads glossary data from the JSON file.
 */
function loadGlossary() {
  try {
    const data = fs.readFileSync(GLOSSARY_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`[VitePress Glossary Plugin] Failed to load glossary.json: ${error.message}`);
    return {};
  }
}

const glossaryTerms = loadGlossary();

// Regex to match terms wrapped in `// //` for escaping.
const escapedTermRegex = /\/\/([^\/]+?)\/\//g;

// Regex to match glossary terms based on loaded glossaryTerms keys.
const glossaryRegex = new RegExp(`\\b(${Object.keys(glossaryTerms).join('|')})\\b`, 'g');

export const markdownGlossaryPlugin = (md) => {
  const defaultTextRender = md.renderer.rules.text;

  md.renderer.rules.text = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    let content = token.content;

    // Replace `//text//` with `<span class="no-glossary">text</span>` to explicitly skip glossary processing.
    content = content.replace(escapedTermRegex, (match, term) => {
      return `<span class="no-glossary">${term}</span>`;
    });

    // Optimize: if no glossary terms are present, use the default renderer.
    if (!glossaryRegex.test(content)) {
      return defaultTextRender(tokens, idx, options, env, self);
    }

    glossaryRegex.lastIndex = 0; // Reset regex lastIndex before using it again.

    // Replace standard glossary terms with the GlossaryTooltip component HTML.
    content = content.replace(glossaryRegex, (match) => {
      // Check if the current match is inside a previously inserted 'no-glossary' span.
      const isEscaped = content.includes(`<span class="no-glossary">${match}</span>`);

      if (isEscaped) {
        return match; // If escaped, return the term as-is.
      }

      // Perform a case-sensitive lookup for the term in the glossary.
      const exactTerm = Object.keys(glossaryTerms).find(term => term === match);

      if (exactTerm) {
        const description = glossaryTerms[exactTerm];
        // Return the HTML for the GlossaryTooltip component with URL-encoded description.
        return `<GlossaryTooltip description="${encodeURIComponent(description)}">${match}</GlossaryTooltip>`;
      }
      return match; // If not a defined glossary term, return the original text.
    });

    return content;
  };
};
```

### 6. Theme index.js 
   This file registers your custom Vue component globally so Markdown can use it.

Update or Create `.vitepress/theme/index.js`:
```javascript
import DefaultTheme from 'vitepress/theme';
import GlossaryTooltip from './components/GlossaryTooltip.vue';

import './custom.css'; // Your custom CSS file

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // Register the GlossaryTooltip component globally
    app.component('GlossaryTooltip', GlossaryTooltip);
  }
};
```

### Configuration
You need to tell VitePress to use your custom Markdown-Glossary plugin.

Open `.vitepress/config.js` or `.vitepress/config.mts` and add/update the markdown section:
```javascript
import { defineConfig } from 'vitepress';
// Import Markdown-Glossary plugin
import { markdownGlossaryPlugin } from './plugins/markdown-glossary.js';

export default defineConfig({
  // ... other existing configurations

  // Configure Markdown-Glossary
  markdown: {
    // The `config` function allows you to extend the Markdown-Glossary instance.
    config: (md) => {
      md.use(markdownGlossaryPlugin); // Apply your glossary plugin
    }
  },

  // ... rest of your VitePress config
});
```

### Linking Terms in Markdown
Once a term is defined in `glossary.json` , simply use it as plain text in your Markdown files. The plugin will automatically identify it and apply the interactive tooltip.

### Escaping Terms
If you want to use a term that is in your `glossary.json` but not have it linked or show a tooltip in a specific instance (e.g., in a code example or as a literal string), wrap it in `// //` (double slashes):
```markdown
The `//IPN//` variable is used in this script.
We calculated the `**//MRR//**"` based on raw data.
The LTV is $100.
```
> The output will show "//IPN//" as plain text and "**//MRR//**" as bold text without any linking or tooltip, and without the // // markers. But it will show "LTV" as a tooltip.

### Customization
You can customize the appearance of your glossary terms and tooltips by modifying the CSS in `.vitepress/theme/custom.css` or the `<style scoped>` section of `.vitepress/theme/components/GlossaryTooltip.vue`.
- markdown-glossary-term (in `GlossaryTooltip.vue`): Styles for the linked text itself (e.g., `underline`, `color`, `cursor`).
- markdown-glossary-tooltip (in `GlossaryTooltip.vue`): Styles for the tooltip popup (e.g., `background`, `border`, `text color`, `shadow`, `positioning`).
- no-glossary (in `custom.css`): You can add styles here if you want escaped terms to look different (e.g., a specific font style or color).