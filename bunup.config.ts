import { defineConfig } from 'bunup';

export default defineConfig({
  entry: 'src/index.ts',
  format: ['esm', 'cjs'],
  outDir: 'dist',
  dts: true,
  sourcemap: 'linked',
  packages: 'external',
  exports: false,
  clean: true,
  target: 'browser',
  drop: ['console', 'debugger'],
});
