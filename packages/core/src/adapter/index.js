/**
 * DS Adapter interface — the contract any styling adapter must implement.
 * Adapters translate semantic token paths and component variant names
 * into framework-specific output (Tailwind classes, MUI theme props, Bootstrap classes).
 */
/**
 * Create a design system instance with a specific adapter.
 */
export function createSystem(config) {
    return {
        adapter: config.adapter,
        tokens: config.tokens,
        theme: config.theme ?? 'light',
        resolveClass: (component, variant, size) => config.adapter.resolveClass(component, variant, size),
        resolveToken: (path) => config.adapter.resolveToken(path, 'css-var'),
    };
}
//# sourceMappingURL=index.js.map