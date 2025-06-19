export interface GlossaryPluginOptions {
  /** Path to the glossary.json file */
  glossaryPath?: string;
  /** Direct glossary object where keys are terms and values are definitions */
  glossary?: Record<string, string>;
  /** If true, only the first occurrence of each term per page will be linked */
  firstOccurrenceOnly?: boolean;
}

export declare const markdownGlossaryPlugin: (md: any, options?: GlossaryPluginOptions) => void; 