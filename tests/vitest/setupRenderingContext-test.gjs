import { trackedObject } from "@ember/reactive/collections";
import { describe, test, expect as hardExpect } from "vitest";
import { screen } from "@testing-library/dom";
import { fireEvent } from "testing-library-ember";
import Service, { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import Component from "@glimmer/component";
import Router from "@ember/routing/router";
import Application from "ember-strict-application-resolver";

import { setupRenderingContext } from "ember-vitest";

const expect = hardExpect.soft;

describe("setupRenderingContext", () => {
  test("it works", async () => {
    using ctx = await setupRenderingContext();

    await ctx.render(<template>hello there</template>);

    expect(ctx.element.textContent).contains("hello there");
  });

  test("has interactivity", async () => {
    using ctx = await setupRenderingContext();

    const state = trackedObject({ value: 0 });
    const increment = () => state.value++;

    await ctx.render(
      <template>
        <button onclick={{increment}}>click me</button>
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

  test("can access services in the test", async () => {
    class DemoService extends Service {
      @tracked count = 0;
      increment = () => this.count;
    }

    class App extends Application {
      modules = {
        "./services/demo": DemoService,
      };
    }

    using ctx = await setupRenderingContext(App);

    let demo = ctx.owner.lookup("service:demo");

    expect(demo.count).toBe(0);
  });

  test("can access services in a component", async () => {
    class DemoService extends Service {
      @tracked count = 0;
      increment = () => this.count++;
    }

    class App extends Application {
      modules = {
        "./services/demo": DemoService,
      };
    }

    using ctx = await setupRenderingContext(App);

    class Demo extends Component {
      @service demo;

      <template>
        <button onclick={{this.demo.increment}}>click me</button>
        <output>{{this.demo.count}}</output>
      </template>
    }

    await ctx.render(<template><Demo /></template>);

    let btn = ctx.find("button");
    let out = ctx.find("output");

    expect(btn).toBeTruthy();
    expect(out.textContent).toBe("0");

    await ctx.click(btn);
    expect(out.textContent).toBe("1");
  });
});
