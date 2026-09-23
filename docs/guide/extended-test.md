# Extended `test`

`applicationTest`, `renderingTest`, and `test` set up your app and an `@ember/test-helpers` context before each test.
They match `setupApplicationTest`, `setupRenderingTest`, and `setupTest` from QUnit.

## Why choose it

Choose the extended `test` over [`render`](./render) and [`setupRenderingContext`](./setup-rendering-context) for these reasons:

- All of `@ember/test-helpers` works, including `render`, `visit`, and `currentURL`.
- Application tests boot your app with its router, so you can test routes and user flows.
- Test helpers that libraries build on `@ember/test-helpers` work as they do in QUnit. `@ember/test-helpers` does not depend on a test framework, so a library does not need a vitest version of its helpers.
- Tests that you move from QUnit need the fewest changes.

::: warning
These functions are an experiment, and semver does not cover them.
Tests that use them cannot run in parallel, because `setApplication` from `@ember/test-helpers` is global.
:::

## Application tests

Use application tests to visit routes and follow user flows.

```gjs
// tests/application/sample-test.gjs
import { describe, expect } from "vitest";
import { applicationTest } from "ember-vitest";
import { visit } from "@ember/test-helpers";

import App from "./your/app/location";

describe("Home", () => {
  applicationTest.override("app", () => App);

  applicationTest("can visit the home screen", async ({ element }) => {
    await visit("/");

    expect(element.textContent).toBe("hello there");
  });
});
```

## Rendering tests

Use rendering tests for components, reactivity, the DOM, and modifiers.

```gjs
import { describe, expect } from "vitest";
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

## Container tests

Use container tests like unit tests, when the code needs the owner of your app.

```gjs
import { describe, expect } from "vitest";
import { test } from "ember-vitest";

import App from "./your/app/location";

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

## The test context

The test callback gets these values:

```js
`renderingTest|applicationTest|test`(
  "name of your test here",
  ({
    // The element that the component or application renders into.
    element,
    // The test context. It has only the owner.
    context: { owner },
    // The internal test setup.
    // env.owner is context.owner, and env.element is element.
    env: { owner, element, pauseTest },
  }) => {},
);
```
