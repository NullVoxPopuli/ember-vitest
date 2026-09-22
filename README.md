# ember-vitest

ember <-> vitest integration

- browser testing is first class
- pause test execution for UI debugging purposes (and without pausing JS execution)
- continue using familiar helpers as you would in qunit

## Install

```
npm add --save-dev ember-vitest vitest @vitest/browser @vitest/browser-webdriverio
```

## Usage

After [#setup](#setup), run:

```bash
pnpm vitest
# or
npm exec vitest
```

### Using vitest's `test`

> [!NOTE]
> We use [`expect.soft`](https://vitest.dev/api/expect.html#soft) for better ergonomics in test reporting so when a test starts failing we can get the whole picture of the test at once, rather than have to address one failure at a time.

#### Rendering Tests

A basic test can be written like:

```gjs
import { describe, test, expect as hardExpect } from "vitest";
import { setupRenderingContext } from "ember-vitest";

const expect = hardExpect.soft;

describe("example", () => {
  test("it works", async () => {
    await using ctx = setupRenderingContext();

    await ctx.render(<template>hello there</template>);

    expect(ctx.element.textContent).contains("hello there");
  });
```

Interactions go through vitest's [`userEvent`](https://vitest.dev/api/browser/interactivity), so they use the real browser and show up in the [trace view](https://vitest.dev/guide/browser/trace-view). `ctx.click` waits for Ember to settle afterwards, so you can assert right away.

```gjs
import { trackedObject } from "@ember/reactive/collections";
import { describe, test, expect as hardExpect } from "vitest";

import { setupRenderingContext } from "ember-vitest";

const expect = hardExpect.soft;

describe("example", () => {
  test("has interactivity", async () => {
    await using ctx = setupRenderingContext();

    const state = trackedObject({ value: 0 });
    const increment = () => state.value++;

    await ctx.render(
      <template>
        <button onclick={{increment}}>click me</button>
        <output>{{state.value}}</output>
      </template>,
    );

    let out = ctx.find("output");

    expect(out.textContent).toBe("0");

    await ctx.click("button");
    expect(out.textContent).toBe("1");
  });
});
```

The returned `ctx` from the `setupRenderingContext` has the following APIs:

- `element`
- `owner`
- `find(selector)`
- `findAll(selector)`
- `click(selector, element or locator)`, through `userEvent`, then waits for settled
- `render(component)`
- `locator`, a vitest [locator](https://vitest.dev/api/browser/locators) for `element`
- `getByRole`, `getByText`, `getByTestId` and the other [locator selectors](https://vitest.dev/api/browser/locators), scoped to `element`

A context that a test does not dispose is torn down after that test, so one leaked `using` does not break the next test.

`render` records an `ember.render` entry in the vitest [trace view](https://vitest.dev/guide/browser/trace-view) when `browser.traceView` is on.

The `@ember/test-helpers` helpers (`fillIn`, `triggerEvent`, `visit`, and the rest) record an entry too, through their [hooks](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#registerhook). `ctx.click` and `ctx.render` run the `click` and `render` hooks, so a hook registered with `registerHook` sees them as well.

The locators work with [`expect.element`](https://vitest.dev/api/browser/assertions), which retries until the assertion passes:

```gjs
await ctx.getByRole("button").click();

await expect.element(ctx.getByRole("status")).toHaveTextContent("1");
```

### Using extended `test`

> [!NOTE]
> These utilities are an experiment and will not be covered un semver, and unfortunately, use of these utilities prevents the ability to run tests in parallel (this is a limitation of `@ember/test-helpers`'s `setApplication`)

#### Application Tests

These tests are generally for when you visit specific pages and simulate user flows.

```gjs
// tests/application/sample-test.gjs
import { describe, it, expect } from "vitest";
import { applicationTest } from "ember-vitest";
import { visit, pauseTest } from "@ember/test-helpers";

import App from "./your/app/location";

describe("Home", () => {
  applicationTest.override("app", () => App);

  applicationTest("can visit the home screen", async ({ element }) => {
    await visit("/");

    expect(element.textContent).toBe("hello there");
  });
});
```

#### Rendering Tests

These sorts of tests are very versatile, as they enable you to test not just components, but reactivity, DOM, modifiers, and more!

```gjs
import { describe, it, expect } from "vitest";
import { renderingTest } from "ember-vitest";
import { find, render, settled } from "@ember/test-helpers";
import { page } from "vitest/browser";

import { Counter } from "#src/components/counter";

describe("Counter", () => {
  // Optional: only needed if your component needs access to application state
  // renderingTest.override("app", () => App);

  renderingTest("can interact", async () => {
    await render(<template><Counter /></template>);

    expect(find("output").textContent).toBe("0");

    await page.getByRole("button").click();
    await settled();

    expect(find("output").textContent).toBe("1");
  });
});
```

#### Container Tests

These tests are sort of like unit tests, but when you need your application owner present.

```gjs
import { describe, it, expect } from "vitest";
import { test } from "ember-vitest";

describe("Container test", () => {
  test.override("app", () => App);

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

### Test Context

The test callback has some extra data available in it that you may find useful

```js
`renderingTest|applicationTest|test`(
  "name of your test here",
  ({
    /**
            The element the component or application is rendered in to
        */
    element,
    /**
            The test context. This only has the owner
        */
    context: { owner },
    /**
            the env is where most of the test setup is interanally.
            the env.owner here is === context.owner, and the env.element is === element
        */
    env: { owner, element, pauseTest },
  }) => {},
);
```

## Setup

In order to use ember-vitest, you must have a vite config with plugins configured for compiling ember, as well as telling `test.include` to include the gjs / gts files.:

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

Your actual vite config may vary.
