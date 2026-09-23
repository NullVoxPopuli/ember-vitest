import { trackedObject } from "@ember/reactive/collections";
import Service, { service } from "@ember/service";
import Component from "@glimmer/component";
import Application from "ember-strict-application-resolver";
import { describe, test, expect } from "vitest";

import { render } from "ember-vitest";

const Button = <template>
  <button type="button" ...attributes>{{yield}}</button>
</template>;

describe("render", () => {
  test("forwards native disabled behavior", async () => {
    const screen = await render(
      <template>
        <Button disabled>Unavailable</Button>
      </template>,
    );

    await expect
      .element(screen.getByRole("button", { name: "Unavailable" }))
      .toBeDisabled();
  });

  test("locators keep working after the content changes", async () => {
    const state = trackedObject({ value: 0 });
    const increment = () => state.value++;

    const screen = await render(
      <template>
        <button onclick={{increment}}>click me</button>
        <output>{{state.value}}</output>
      </template>,
    );

    await screen.getByRole("button").click();
    await screen.getByRole("button").click();

    await expect.element(screen.getByRole("status")).toHaveTextContent("2");
    await expect.element(screen.locator).toHaveTextContent("click me 2");
  });

  test("args", async () => {
    const args = trackedObject({ name: "there" });

    class Greeting extends Component {
      <template>hello {{@name}}</template>
    }

    const screen = await render(Greeting, { args });

    expect(screen.container.textContent).toBe("hello there");

    args.name = "you";

    await expect.element(screen.locator).toHaveTextContent("hello you");
  });

  test("owner", async () => {
    class Demo extends Service {
      message = "from a service";
    }

    class App extends Application {
      modules = {
        "./services/demo": Demo,
      };
    }

    class ShowMessage extends Component {
      @service demo;

      <template>{{this.demo.message}}</template>
    }

    const app = App.create({ autoboot: false });
    await app.boot();
    const instance = app.buildInstance();
    await instance.boot();

    const screen = await render(ShowMessage, { owner: instance });

    expect(screen.container.textContent).toBe("from a service");

    instance.destroy();
    app.destroy();
  });

  test("unmount", async () => {
    const screen = await render(
      <template>
        <output>here</output>
      </template>,
    );

    expect(document.body.contains(screen.container)).toBe(true);

    await screen.unmount();

    expect(document.body.contains(screen.container)).toBe(false);
    expect(screen.container.textContent).toBe("");
  });
});

// These two tests must stay in this order.
describe("render cleanup between tests", () => {
  test("a test that renders", async () => {
    await render(
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
