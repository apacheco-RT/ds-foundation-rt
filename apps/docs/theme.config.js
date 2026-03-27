const config = {
    logo: <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>DS Foundation</span>,
    project: { link: 'https://github.com/your-org/ds-foundation' },
    docsRepositoryBase: 'https://github.com/your-org/ds-foundation/tree/main/apps/docs',
    useNextSeoProps: () => ({ titleTemplate: '%s — DS Foundation' }),
    darkMode: true,
    footer: {
        text: `DS Foundation · DTCG 2025.10 · ${new Date().getFullYear()}`,
    },
    sidebar: {
        defaultMenuCollapseLevel: 1,
        autoCollapse: true,
    },
};
export default config;
//# sourceMappingURL=theme.config.js.map