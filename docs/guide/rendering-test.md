# `renderingTest`

`renderingTest` sets up the same `@ember/test-helpers` context as `setupRenderingTest` in QUnit.
Use rendering tests for components, reactivity, the DOM, and modifiers.

This is one of the [extended `test`](./extended-test) functions. See that page for why to choose them and for the values that the test callback gets.

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
