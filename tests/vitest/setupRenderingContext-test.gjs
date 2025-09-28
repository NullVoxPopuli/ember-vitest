import { trackedObject } from "@ember/reactive/collections";
import { describe, test, expect as hardExpect } from "vitest";
import { screen } from "@testing-library/dom";
import { fireEvent } from "testing-library-ember";

import { setupRenderingContext } from "ember-vitest";

const expect = hardExpect.soft;

describe("setupRenderingContext", () => {
  test("it works", async () => {
    using ctx = setupRenderingContext();

    await ctx.render(<template>hello there</template>);

    expect(ctx.element.textContent).contains("hello there");
  });

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
