// .vitepress/plugins/markdown-glossary.js

// Import Node.js path and file system modules.
// These are used to read the glossary.json file during the Node.js build process.
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import fs from 'node:fs';

// Get the current directory name, as `__dirname` is not available in ES modules.
const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve the path to our glossary.json file.
// It's located one level up from the 'plugins' directory, in the '.vitepress' directory.
const GLOSSARY_FILE_PATH = resolve(__dirname, '../glossary.json');

/**
 * Loads glossary data from the JSON file.
 * This function will be called once when the VitePress build starts.
 * @returns {Record<string, string>} An object where keys are glossary terms and values are their definitions.
 */
function loadGlossary() {
    try {
        // Read the file synchronously. This is acceptable as it runs during build time.
        const data = fs.readFileSync(GLOSSARY_FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`[VitePress Glossary Plugin] Failed to load glossary.json: ${error.message}`);
        return {}; // Return an empty object to prevent errors down the line
    }
}

// Load the glossary terms once when the plugin is initialized.
const glossaryTerms = loadGlossary();

// Create a regular expression from the glossary terms.
// This regex will be used to efficiently find all defined terms in the Markdown content.
// - `\b`: Word boundary to match whole words.
// - `(${Object.keys(glossaryTerms).join('|')})`: Creates a non-capturing group with all terms
//   joined by `|` (OR) operator. Terms are escaped to handle special regex characters if any.
//   Note: For simplicity, basic escaping is not included here. For production,
//   you might want a utility to escape regex special characters in terms.
// - `gi`: Global (find all matches), Case-Insensitive (we'll handle case sensitivity in logic).
//   We use `gi` here for the initial scan, but will enforce case sensitivity on the exact match later.
const glossaryRegex = new RegExp(`\\b(${Object.keys(glossaryTerms).join('|')})\\b`, 'gi');

/**
 * Markdown-it plugin for automatically linking glossary terms.
 * This plugin modifies the Markdown parsing and rendering process.
 *
 * @param {import('markdown-it')} md - The Markdown-it instance.
 */
export const markdownGlossaryPlugin = (md) => {
    const defaultTextRender = md.renderer.rules.text;
    const escapedTermRegex = /\/\/([^\/]+?)\/\//g;

    md.renderer.rules.text = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        let content = token.content;

        // Replace //text// with <span class="no-glossary">text</span> to skip glossary processing
        content = content.replace(escapedTermRegex, (match, term) => {
            return `<span class="no-glossary">${term}</span>`;
        });

        // Process glossary terms only if regex matches
        if (!glossaryRegex.test(content)) {
            return defaultTextRender(tokens, idx, options, env, self);
        }

        glossaryRegex.lastIndex = 0;

        // Replace glossary terms with tooltips, avoiding no-glossary spans
        content = content.replace(glossaryRegex, (match) => {
            // Check if match is inside a no-glossary span
            const isEscaped = content.match(new RegExp(`<span class="no-glossary">${match}</span>`));
            if (isEscaped) {
                return match; // Return the term as-is if it’s escaped
            }

            const exactTerm = Object.keys(glossaryTerms).find(term => term === match);
            if (exactTerm) {
                const description = glossaryTerms[exactTerm];
                return `<GlossaryTooltip description="${encodeURIComponent(description)}">${match}</GlossaryTooltip>`;
            }
            return match;
        });

        // Return the modified HTML content
        return content;
    };
};