// Markdown Glossary Plugin for VitePress

/**
 * Loads glossary data from the JSON file.
 * This function will be called once when the VitePress build starts.
 * @returns {Record<string, string>} An object where keys are glossary terms and values are their definitions.
 */
function loadGlossary(glossaryPath) {
    try {
        // Read the file synchronously. This is acceptable as it runs during build time.
        const fs = require('fs');
        const data = fs.readFileSync(glossaryPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`[VitePress Glossary Plugin] Failed to load glossary.json: ${error.message}`);
        return {}; // Return an empty object to prevent errors down the line
    }
}

/**
 * Markdown-it plugin for automatically linking glossary terms.
 * This plugin modifies the Markdown parsing and rendering process.
 *
 * @param {import('markdown-it')} md - The Markdown-it instance.
 * @param {Object} options - Plugin options
 * @param {string} [options.glossaryPath] - Path to the glossary.json file
 * @param {Object} [options.glossary] - Direct glossary object where keys are terms and values are definitions
 * @param {boolean} [options.firstOccurrenceOnly] - If true, only the first occurrence of each term per page will be linked
 */
export const markdownGlossaryPlugin = (md, options = {}) => {
    const defaultTextRender = md.renderer.rules.text;
    const escapedTermRegex = /\/\/([^\/]+?)\/\//g;
    
    // Default options
    const config = {
        glossaryPath: './.vitepress/glossary.json',
        firstOccurrenceOnly: false,
        ...options
    };
    
    // Load the glossary terms - either from direct object or file
    const glossaryTerms = config.glossary || (config.glossaryPath ? loadGlossary(config.glossaryPath) : {});
    
    // Create a regular expression from the glossary terms.
    const glossaryRegex = new RegExp(`\\b(${Object.keys(glossaryTerms).join('|')})\\b`, 'gi');
    
    // Track processed terms per page (reset for each page)
    let processedTerms = new Set();

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
                return match; // Return the term as-is if it's escaped
            }

            const exactTerm = Object.keys(glossaryTerms).find(term => term === match);
            if (exactTerm) {
                // Check if first occurrence only is enabled and term was already processed
                if (config.firstOccurrenceOnly && processedTerms.has(exactTerm)) {
                    return match; // Return the term as-is if already processed
                }
                
                // Mark this term as processed
                if (config.firstOccurrenceOnly) {
                    processedTerms.add(exactTerm);
                }
                
                const description = glossaryTerms[exactTerm];
                return `<GlossaryTooltip description="${encodeURIComponent(description)}">${match}</GlossaryTooltip>`;
            }
            return match;
        });

        // Return the modified HTML content
        return content;
    };
    
    // Reset processed terms when a new page starts
    const originalRender = md.render;
    md.render = function(src, env) {
        // Reset processed terms for each new page
        if (config.firstOccurrenceOnly) {
            processedTerms.clear();
        }
        return originalRender.call(this, src, env);
    };
}; 