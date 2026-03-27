/**
 * DS Adapter interface — the contract any styling adapter must implement.
 * Adapters translate semantic token paths and component variant names
 * into framework-specific output (Tailwind classes, MUI theme props, Bootstrap classes).
 */
export type AdapterName = 'tailwind' | 'material' | 'bootstrap' | 'custom';
export interface DSAdapter {
    /** Unique adapter identifier */
    name: AdapterName;
    /**
     * Resolve a component variant to its framework-specific class string or prop set.
     * @param component - Registry component id (e.g. 'button')
     * @param variant   - Variant name (e.g. 'solid', 'outline')
     * @param size      - Optional size modifier
     */
    resolveClass: (component: string, variant: string, size?: string) => string;
    /**
     * Resolve a DTCG semantic token path to its output value.
     * @param tokenPath - Dot-notation path (e.g. 'color.brand.primary')
     * @param format    - Output format: 'css-var' | 'hex' | 'raw'
     */
    resolveToken: (tokenPath: string, format?: 'css-var' | 'hex' | 'raw') => string;
    /**
     * Wrap a full token set into the adapter's theme format.
     * For Tailwind: returns a @theme CSS block.
     * For Material: returns a MUI createTheme() object.
     * For Bootstrap: returns SCSS variable overrides.
     */
    wrapTheme: (tokens: TokenSet) => AdapterTheme;
}
export type TokenSet = Record<string, string | number | object>;
export type AdapterTheme = {
    type: 'css';
    content: string;
} | {
    type: 'js';
    content: object;
} | {
    type: 'scss';
    content: string;
};
/**
 * Create a design system instance with a specific adapter.
 */
export declare function createSystem(config: {
    adapter: DSAdapter;
    tokens: TokenSet;
    theme?: 'light' | 'dark' | 'light-hc' | 'dark-hc';
}): {
    adapter: DSAdapter;
    tokens: TokenSet;
    theme: "light" | "dark" | "light-hc" | "dark-hc";
    resolveClass: (component: string, variant: string, size?: string) => string;
    resolveToken: (path: string) => string;
};
//# sourceMappingURL=index.d.ts.map