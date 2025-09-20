# ember-vitest

Ember<->Vitest integration

- pause test execution for UI debugging purposes (and without pausing JS execution)
- continue using familiar helpers as you would in qunit
-

## Install

```
npm add --save-dev ember-vitest vitest  @vitest/browser webdriverio
```

## Usage

After [#setup](#setup), run:

```bash
pnpm vitest
# or
npm exec vitest
```

### Application Tests

```gjs
// tests/application/sample-test.gjs

import { describe, it, expect } from 'vitest';
import { setupApplicationTest } from 'ember-vitest';
import { visit, pauseTest } from '@ember/test-helpers';

describe("Application | Home", () => {
    it('can visit the home screen', async () => {
        await visit('/');

        // Uncomment to debug the app without pausing JS
        // await pauseTest();

    });
});
```

### Rendering Tests

```gjs
import { describe, it, expect } from 'vitest';
import { setupRenderingTest } from 'ember-vitest';
import { visit, pauseTest } from '@ember/test-helpers';

class Conter

describe("Rendering | Counter", () => {
    it('can interact', async () => {
        await visit('/');

        // Uncomment to debug the app without pausing JS
        // await pauseTest();

    });
});
```

### Container Tests

### Pausing Test Execution

you may use `pauseTest` and `resumeTest` just as you would in qunit, but vitest does not allow changing the test timeout within a test, so when paused, you only have until your test timeout to debug.

To get around this, you'll probably want to bump the testTimeout in the vite config to a few minutes.

```js
export default defineConfig({
  test: {
    testTimeout: 120_000_000, // ms
    // ...
});
```

## Setup

In order to use ember-vitest, you must have a vite config with plugins configured for compiling ember, as well as telling `test.include` to include the gjs / gts files.:

```js
// vite.config.js
import { defineConfig } from "vite";

import { ember, extensions } from "@embroider/vite";
import { babel } from "@rollup/plugin-babel";

export default defineConfig({
  // Add this config
  test: {
    include: ["tests/**/*-test.{gjs,gts}"],
    browser: {
      provider: "webdriverio",
      enabled: true,
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

Your actual vite config may vary.
