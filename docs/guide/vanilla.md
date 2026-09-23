# Vanilla vitest

You do not need anything from ember-vitest to render a component in a vitest browser test.
You create an element, pass it to each helper, and clean it up at the end of the test.

```gjs
import { renderComponent } from "@ember/renderer";
import { settled } from "@ember/test-helpers";
import { describe, test, expect, onTestFinished } from "vitest";

describe("example", () => {
  test("it works", async () => {
    let element = document.createElement("div");
    document.body.append(element);
    onTestFinished(() => element.remove());

    let result = renderComponent(
      <template>hello there</template>,
      {
        into: element,
      },
    );
    onTestFinished(() => result.destroy());
    await settled();

    expect(element.textContent).contains("hello there");
  });
});
```

For interactions, use vitest's [`userEvent`](https://vitest.dev/api/browser/interactivity), then wait for Ember with `settled`:

```gjs
import { trackedObject } from "@ember/reactive/collections";
import { renderComponent } from "@ember/renderer";
import { settled } from "@ember/test-helpers";
import { describe, test, expect, onTestFinished } from "vitest";
import { userEvent } from "vitest/browser";

describe("example", () => {
  test("has interactivity", async () => {
    let element = document.createElement("div");
    document.body.append(element);
    onTestFinished(() => element.remove());

    const state = trackedObject({ value: 0 });
    const increment = () => state.value++;

    let result = renderComponent(
      <template>
        <button onclick={{increment}}>click me</button>
        <output>{{state.value}}</output>
      </template>,
      { into: element },
    );
    onTestFinished(() => result.destroy());
    await settled();

    let out = element.querySelector("output");

    expect(out.textContent).toBe("0");

    await userEvent.click(element.querySelector("button"));
    await settled();

    expect(out.textContent).toBe("1");
  });
});
```

To scope vitest [locators](https://vitest.dev/api/browser/locators) to the element, give the element a test id first.
A locator finds its element again with a selector.
Without a test id, that selector uses the text of the element, and the text changes when the test interacts with it.

```gjs
import { page } from "vitest/browser";

// ...

element.dataset.testid = "container";

let screen = page.elementLocator(element);

await screen.getByRole("button").click();

await expect.element(screen.getByRole("status")).toHaveTextContent("1");
```

[`render`](./render), [`setupRenderingContext`](./setup-rendering-context), and the [extended `test`](./extended-test) do this setup and cleanup for you.
