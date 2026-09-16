import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { describe, it, expect } from "vitest";
import { renderingTest } from "ember-vitest";
import { find, render, settled } from "@ember/test-helpers";
import { page } from "vitest/browser";

class Counter extends Component {
  @tracked count = 0;
  increment = () => this.count++;

  <template>
    <output>{{this.count}}</output>
    <button onclick={{this.increment}}>++</button>
  </template>
}

describe("Counter", () => {
  renderingTest("can interact", async () => {
    await render(<template><Counter /></template>);

    expect(find("output").textContent).toBe("0");

    await page.getByRole("button").click();
    await settled();

    expect(find("output").textContent).toBe("1");
  });
});
