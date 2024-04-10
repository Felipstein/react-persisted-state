/* eslint-disable import/no-extraneous-dependencies */

import path from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ include: ['lib'] })],
  build: {
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__dirname, 'lib/usePersistedState.ts'),
      formats: ['es', 'cjs'],
    },
  },
});
