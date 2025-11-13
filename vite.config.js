import { webdriverio } from "@vitest/browser-webdriverio";
import { defineConfig } from "vite";

import { ember, extensions } from "@embroider/vite";
import { babel } from "@rollup/plugin-babel";

export default defineConfig({
  test: {
    include: ["tests/**/*-test.{gjs,gts}"],
    maxConcurrency: 1,
    browser: {
      enabled: true,
      provider: webdriverio(),
      // at least one instance is required
      instances: [
        { browser: "chrome" },
        // { browser: 'firefox' },
        // { browser: 'edge' },
        // { browser: 'safari' },
      ],
    },
  },
  optimizeDeps: {
    include: [
      "@glimmer/component",
      "@ember/test-helpers",
      "ember-strict-application-resolver",
      "ember-source/@ember/component/index.js",
      "ember-source/@ember/service/index.js",
      "ember-source/@ember/template-factory/index.js",
      "ember-source/@ember/component/template-only.js",
      "ember-source/@glimmer/tracking/index.js",
    ],
  },
  plugins: [
    ember(),
    babel({
      babelHelpers: "runtime",
      extensions,
    }),
  ],
});
