import { describe, test, expect } from "vitest";
import { setupRenderingContext } from "ember-vitest";

// These two tests must stay in this order.
describe("cleanup between tests", () => {
  test("a test that forgets to dispose", async () => {
    let ctx = await setupRenderingContext();

    await ctx.render(
      <template>
        <output>leaked</output>
      </template>,
    );

    expect(document.body.querySelector("output")).not.toBeNull();
  });

  test("the next test starts with a clean document", async () => {
    expect(document.body.querySelector("output")).toBeNull();
  });
});
