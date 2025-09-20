import { defineConfig } from 'vite';

import { ember, extensions } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

export default defineConfig({
  test: {
    include: ['tests/**/*-test.*'],
    browser: {
      provider: 'webdriverio',
      enabled: true,
      // at least one instance is required
      instances: [
        { browser: 'chromium' },
      ],
    },
  },
  plugins: [
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    })
  ]
});
