import EmberRouter from "@ember/routing/router";
import Application from "ember-strict-application-resolver";
import { describe, test, expect } from "vitest";

import { render, visit } from "ember-vitest";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Router extends EmberRouter {
  rootURL = "/";
}

Router.map(function () {
  this.route("about");
});

class App extends Application {
  modules = {
    "./router": Router,
    "./templates/index": <template>
      <h1>Home</h1>
    </template>,
    "./templates/about": <template>
      <h1>About</h1>
    </template>,
  };
}

// Each test records when it renders and when it checks,
// so the last test can prove that the tests overlapped.
const log = [];

describe.concurrent("concurrent tests with the test context", () => {
  test("slow render", async (context) => {
    const screen = await render(
      <template>
        <output>slow</output>
      </template>,
      {
        context,
      },
    );
    log.push("slow rendered");

    await sleep(300);

    log.push("slow checks");
    context.expect(document.body.contains(screen.container)).toBe(true);
    context.expect(screen.container.textContent).toBe("slow");
  });

  test("fast render", async (context) => {
    const screen = await render(
      <template>
        <output>fast</output>
      </template>,
      {
        context,
      },
    );
    log.push("fast rendered");

    await sleep(50);

    log.push("fast done");
    context.expect(screen.container.textContent).toBe("fast");
  });

  test("slow visit", async (context) => {
    const screen = await visit(App, "/about", { context });
    log.push("visit rendered");

    await sleep(300);

    log.push("visit checks");
    context.expect(document.body.contains(screen.container)).toBe(true);
    context.expect(screen.currentURL).toBe("/about");
  });

  test("unmount before the test finishes", async (context) => {
    const screen = await render(
      <template>
        <output>gone</output>
      </template>,
      {
        context,
      },
    );

    await screen.unmount();

    context.expect(document.body.contains(screen.container)).toBe(false);
  });

  test("the tests overlapped", async (context) => {
    await sleep(500);

    context
      .expect(log.indexOf("fast done"))
      .toBeLessThan(log.indexOf("slow checks"));
    context
      .expect(log.indexOf("slow rendered"))
      .toBeLessThan(log.indexOf("fast done"));
    context
      .expect(log.indexOf("visit rendered"))
      .toBeLessThan(log.indexOf("fast done"));
  });
});

describe("after the concurrent tests", () => {
  test("every render and app was torn down", () => {
    expect(document.body.querySelector("output")).toBeNull();
    expect(document.body.querySelector("h1")).toBeNull();
  });
});
