import { defineConfig } from 'vitest/config';
import path from 'node:path';

/**
 * Vitest 실행 설정이다.
 * 일부 브라우저 API(LocalStorage 등) 테스트를 위해 jsdom 환경을 사용한다.
 */
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
