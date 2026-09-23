# `setupRenderingContext`

`setupRenderingContext` returns a context with an element, an owner, and helpers that render into that element.
Use it when a test renders more than once, or when a component needs services from your app.

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

Interactions go through vitest's [`userEvent`](https://vitest.dev/api/browser/interactivity), so they use the real browser and show in the [trace view](./debugging#trace-view).
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
