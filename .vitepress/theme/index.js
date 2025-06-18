// .vitepress/theme/index.js

import DefaultTheme from 'vitepress/theme';
import GlossaryTooltip from './components/GlossaryTooltip.vue';

// import './custom.css';

/**
 * Main theme enhancement configuration for VitePress.
 * This object is exported and merged with the default theme.
 *
 * @see https://vitepress.dev/guide/custom-theme
 */
export default {
    // Spread the properties of the default theme to inherit its functionalities
    ...DefaultTheme,

    /**
     * enhanceApp is a VitePress hook that allows us to extend the Vue application
     * instance used by VitePress. This is the ideal place to:
     * - Register global components (like our GlossaryTooltip)
     * - Register Vue plugins
     * - Add global properties or provide dependencies
     *
     * @param {object} options - An object containing the Vue app instance.
     * @param {import('vue').App} options.app - The Vue application instance.
     */

    enhanceApp({ app }) {
        // Register custom GlossaryTooltip component globally.
        app.component('GlossaryTooltip', GlossaryTooltip);
    }
};