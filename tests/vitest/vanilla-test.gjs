import { trackedObject } from "@ember/reactive/collections";
import { renderComponent } from "@ember/renderer";
import { settled } from "@ember/test-helpers";
import { describe, test, expect, onTestFinished } from "vitest";
import { page, userEvent } from "vitest/browser";

// These tests mirror the "Vanilla vitest" examples in the README.
describe("vanilla vitest", () => {
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

  test("locators", async () => {
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

    // A locator finds its element again by a selector.
    // Without a test id, that selector uses the text, which the click changes.
    element.dataset.testid = "container";

    let screen = page.elementLocator(element);

    await screen.getByRole("button").click();

    await expect.element(screen.getByRole("status")).toHaveTextContent("1");
  });
});
