import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setupTests.ts'],
    css: true,
    coverage: {
      reporter: ['text', 'html', 'lcov'],
    },
  },
});
