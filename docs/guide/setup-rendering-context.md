# `setupRenderingContext`

`setupRenderingContext` sets up an `@ember/test-helpers` test context around a new element.
It returns a context with that element, an owner, and helpers that render into the element.

## Why choose it

Choose `setupRenderingContext` over [`render`](./render) for these reasons:

- The `@ember/test-helpers` helpers accept selector strings, for example `click("button")`. With `render`, these helpers accept only elements, because no test context exists.
- Test helpers that libraries build on `@ember/test-helpers` can find the rendered content. `@ember/test-helpers` does not depend on a test framework, so these library helpers work in vitest too.
- The owner comes from your app class, so components get the services of your app. With `render`, you build the owner yourself.

Use `ctx.render` to render. The `render` function from `@ember/test-helpers` does not work here.
If a test needs it, or needs `visit`, use the [extended `test`](./extended-test).

::: tip
These examples use [`expect.soft`](https://vitest.dev/api/expect.html#soft).
When a test fails, you see all of the failed assertions at once, not only the first one.
:::

## Rendering

```gjs
import { describe, test, expect as hardExpect } from "vitest";
import { setupRenderingContext } from "ember-vitest";

const expect = hardExpect.soft;

describe("example", () => {
  test("it works", async () => {
    await using ctx = await setupRenderingContext();

    await ctx.render(<template>hello there</template>);

    expect(ctx.element.textContent).contains("hello there");
  });
});
```

## Interactions

Interactions with `ctx.click` go through vitest's [`userEvent`](https://vitest.dev/api/browser/interactivity), so they use the real browser and show in the [trace view](./debugging#trace-view).
`ctx.click` waits for Ember to settle after the click, so you can assert on the next line.

```gjs
import { trackedObject } from "@ember/reactive/collections";
import { describe, test, expect as hardExpect } from "vitest";

import { setupRenderingContext } from "ember-vitest";

const expect = hardExpect.soft;

describe("example", () => {
  test("has interactivity", async () => {
    await using ctx = await setupRenderingContext();

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

## Locators

The locators work with [`expect.element`](https://vitest.dev/api/browser/assertions), which retries until the assertion passes.
`expect.soft` has no `element`, so use the original `expect`:

```gjs
await ctx.getByRole("button").click();

await hardExpect.element(ctx.getByRole("status")).toHaveTextContent("1");
```

## `@ember/test-helpers`

The `@ember/test-helpers` helpers find elements inside `ctx.element`:

```gjs
import { click, fillIn } from "@ember/test-helpers";

await fillIn("input", "hello");
await click("button");
```

## Services

To use the services of your app, pass the app class:

```gjs
import App from "#app/app";

await using ctx = await setupRenderingContext(App);

let session = ctx.owner.lookup("service:session");
```

## The context

The context has:

- `element`
- `owner`
- `find(selector)`
- `findAll(selector)`
- `click(selector, element or locator)`, through `userEvent`, then waits for settled
- `render(component)`
- `locator`, a vitest [locator](https://vitest.dev/api/browser/locators) for `element`
- `getByRole`, `getByText`, `getByTestId` and the other [locator selectors](https://vitest.dev/api/browser/locators), scoped to `element`

If a test does not dispose its context, the context is torn down after that test.
One leaked `using` does not break the next test.
