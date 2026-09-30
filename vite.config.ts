import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      // Alias target must stay in sync with `paths` in tsconfig.json ("@/*": ["./src/*"]).
      // B1.2 / CONF-01: previously resolved to the repository root, which made
      // `@/design-system/...` unresolvable. See docs/aksa/b1/02-b1-subbatch-plan.md.
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
