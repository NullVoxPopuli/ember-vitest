# Setup

Your vite config must compile Ember, and `test.include` must include the `gjs` and `gts` files.

```js
// vite.config.js
import { webdriverio } from "@vitest/browser-webdriverio";
import { defineConfig } from "vite";

import { ember, extensions } from "@embroider/vite";
import { babel } from "@rollup/plugin-babel";

export default defineConfig({
  // Add this config
  test: {
    include: ["tests/**/*-test.{gjs,gts}"],
    // Increase this to run concurrent tests at the same time. See "Parallel tests".
    maxConcurrency: 1,
    browser: {
      provider: webdriverio(),
      enabled: true,
      headless: true,
      // at least one instance is required
      instances: [
        { browser: "chrome" },
        // { browser: 'firefox' },
        // { browser: 'edge' },
        // { browser: 'safari' },
      ],
    },
  },
  // Existing config:
  plugins: [
    ember(),
    babel({
      babelHelpers: "runtime",
      extensions,
    }),
  ],
});
```

Your vite config can be different.
