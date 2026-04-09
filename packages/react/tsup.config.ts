// packages/react/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: false,
  sourcemap: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    // stories are already excluded — index.ts does not import them;
    // this hook is retained for any future esbuild-level overrides
    void options;
  },
});
