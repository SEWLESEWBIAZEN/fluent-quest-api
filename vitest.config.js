// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.js'], // or .ts if you're using TypeScript
    environment: 'node',
  },
});

