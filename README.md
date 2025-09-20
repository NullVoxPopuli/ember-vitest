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

These tests are generally for when you visit specific pages and simulate user flows.

```gjs
// tests/application/sample-test.gjs
import { describe, it, expect } from "vitest";
import { applicationTest } from "ember-vitest";
import { visit, pauseTest } from "@ember/test-helpers";

import App from "./your/app/location";

describe("Home", () => {
  applicationTest.scoped({ app: ({}, use) => use(App) });

  applicationTest("can visit the home screen", async ({ element }) => {
    await visit("/");

    expect(element.textContent).toBe("hello there");
  });
});
```

### Rendering Tests

These sorts of tests are very versatile, as they enable you to test not just components, but reactivity, DOM, modifiers, and more!

```gjs
import { describe, it, expect } from "vitest";
import { renderingTest } from "ember-vitest";
import { find, click, render } from "@ember/test-helpers";

import { Counter } from "#src/components/counter";

describe("Counter", () => {
  // Optional: only needed if your component needs access to application state
  // renderingTest.scoped({ app: ({}, use) => use(App) });

  renderingTest("can interact", async () => {
    await render(<template><Counter /></template>);

    expect(find("output").textContent).toBe("0");

    await click("button");

    expect(find("output").textContent).toBe("1");
  });
});
```

### Container Tests

These tests are sort of like unit tests, but when you need your application owner present.

```gjs
import { describe, it, expect } from "vitest";
import { test } from "ember-vitest";

describe("Container test", () => {
  test.scoped({ app: ({}, use) => use(App) });

  test("can interact", async ({ context }) => {
    let foo = context.owner.lookup("service:foo");

    expect(foo.count).toBe(0);
    foo.count++;
    expect(foo.count).toBe(1);
  });
});
```

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
