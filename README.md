# ember-vitest

Ember<->Vitest integration

- browser testing is first class
- pause test execution for UI debugging purposes (and without pausing JS execution)
- continue using familiar helpers as you would in qunit

## Install

```
npm add --save-dev ember-vitest vitest @vitest/browser
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
    using ctx = setupRenderingContext();

    await ctx.render(<template>hello there</template>);

    expect(ctx.element.textContent).contains("hello there");
  });
```

And interactivity can be done via [`@testing-library/dom`](https://testing-library.com/docs/queries/about) and [`testing-library-ember`](https://github.com/nullvoxpopuli/testing-library-ember/) (which provides settled-state integration with testing-library's `fireEvent` utility, so you don't have to even "wait" or check for things in a loop. This cleans up tests significantly when async rendering is involved.)

```gjs
import { trackedObject } from "@ember/reactive/collections";
import { describe, test, expect as hardExpect } from "vitest";
import { screen } from "@testing-library/dom";
import { fireEvent } from "testing-library-ember";

import { setupRenderingContext } from "ember-vitest";

const expect = hardExpect.soft;

describe("example", () => {
  test("has interactivity", async () => {
    using ctx = setupRenderingContext();

    const state = trackedObject({ value: 0 });
    const increment = () => state.value++;

    await ctx.render(
      <template>
        <button role="button" onclick={{increment}}>click me</button>
        <output>{{state.value}}</output>
      </template>,
    );

    let btn = screen.getByText(/click me/);
    let out = ctx.element.querySelector("output");

    expect(btn).toBeTruthy();
    expect(out.textContent).toBe("0");

    await fireEvent.click(btn);
    expect(out.textContent).toBe("1");
  });
});
```

The returned `ctx` from the `setupRenderingContext` has the following APIs:

- `element`
- `owner`
- `find(selector)`
- `findAll(selector)`
- `click(selector or element)`
- `render(componet)`

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
  applicationTest.scoped({ app: ({}, use) => use(App) });

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

#### Container Tests

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
import { defineConfig } from "vite";

import { ember, extensions } from "@embroider/vite";
import { babel } from "@rollup/plugin-babel";

export default defineConfig({
  // Add this config
  test: {
    include: ["tests/**/*-test.{gjs,gts}"],
    maxConcurrency: 1,
    browser: {
      provider: "webdriverio",
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
