import { trackedObject } from "@ember/reactive/collections";
import { describe, test, expect as hardExpect } from "vitest";
import {
  blur,
  click,
  fillIn,
  focus,
  // `select` is in scope for the template,
  // so `<select>` there invokes the helper as a component.
  select as selectOption,
  triggerEvent,
  triggerKeyEvent,
  typeIn,
} from "@ember/test-helpers";

import { setupRenderingContext } from "ember-vitest";

const expect = hardExpect.soft;

describe("setupRenderingContext with @ember/test-helpers", () => {
  test("fillIn, typeIn and click", async () => {
    using ctx = await setupRenderingContext();

    const state = trackedObject({ name: "", submitted: "" });
    const setName = (event) => (state.name = event.target.value);
    const submit = () => (state.submitted = state.name);

    await ctx.render(
      <template>
        <input oninput={{setName}} />
        <button onclick={{submit}}>submit</button>
        <output>{{state.submitted}}</output>
      </template>,
    );

    await fillIn(ctx.find("input"), "hello");
    expect(state.name).toBe("hello");

    await typeIn(ctx.find("input"), " there");
    expect(state.name).toBe("hello there");

    await click(ctx.find("button"));
    expect(ctx.find("output").textContent).toBe("hello there");
  });

  test("focus, blur, triggerKeyEvent and triggerEvent", async () => {
    using ctx = await setupRenderingContext();

    const events = trackedObject({ log: "" });
    const record = (event) => (events.log += `${event.type} `);
    const recordKey = (event) => (events.log += `${event.type}:${event.key} `);

    await ctx.render(
      <template>
        <input onfocus={{record}} onblur={{record}} onkeydown={{recordKey}} />
        <div onmouseenter={{record}}>hover me</div>
      </template>,
    );

    await focus(ctx.find("input"));
    await triggerKeyEvent(ctx.find("input"), "keydown", "Enter");
    await blur(ctx.find("input"));
    await triggerEvent(ctx.find("div"), "mouseenter");

    expect(events.log).toBe("focus keydown:Enter blur mouseenter ");
  });

  test("select", async () => {
    using ctx = await setupRenderingContext();

    const state = trackedObject({ choice: "" });
    const choose = (event) => (state.choice = event.target.value);

    await ctx.render(
      <template>
        <select onchange={{choose}}>
          <option value="a">A</option>
          <option value="b">B</option>
        </select>
      </template>,
    );

    await selectOption(ctx.find("select"), "b");

    expect(state.choice).toBe("b");
  });
});
