import EmberRouter from "@ember/routing/router";
import Service from "@ember/service";
import { LinkTo } from "@ember/routing";
import Application from "ember-strict-application-resolver";
import { describe, test, expect } from "vitest";

import { visit } from "ember-vitest";

class Router extends EmberRouter {
  rootURL = "/";
}

Router.map(function () {
  this.route("about");
});

class Greeting extends Service {
  message = "hello from a service";
}

class App extends Application {
  modules = {
    "./router": Router,
    "./services/greeting": Greeting,
    "./templates/application": <template>
      <nav><LinkTo @route="about">About</LinkTo></nav>
      {{outlet}}
    </template>,
    "./templates/index": <template>
      <h1>Home</h1>
    </template>,
    "./templates/about": <template>
      <h1>About</h1>
    </template>,
  };
}

describe("visit", () => {
  test("renders the route", async () => {
    const screen = await visit(App, "/");

    await expect.element(screen.getByRole("heading")).toHaveTextContent("Home");
    expect(screen.currentURL).toBe("/");
  });

  test("visits a nested URL", async () => {
    const screen = await visit(App, "/about");

    await expect
      .element(screen.getByRole("heading"))
      .toHaveTextContent("About");
    expect(screen.currentURL).toBe("/about");
  });

  test("links navigate", async () => {
    const screen = await visit(App, "/");

    await screen.getByRole("link", { name: "About" }).click();

    await expect
      .element(screen.getByRole("heading"))
      .toHaveTextContent("About");
    expect(screen.currentURL).toBe("/about");
  });

  test("screen.visit navigates the same app", async () => {
    const screen = await visit(App, "/");
    const owner = screen.owner;

    await screen.visit("/about");

    expect(screen.owner).toBe(owner);
    expect(screen.currentURL).toBe("/about");
    expect(screen.container.querySelector("h1").textContent).toBe("About");
  });

  test("owner", async () => {
    const screen = await visit(App, "/");

    expect(screen.owner.lookup("service:greeting").message).toBe(
      "hello from a service",
    );
  });

  test("does not change the URL of the test page", async () => {
    const before = window.location.href;

    await visit(App, "/about");

    expect(window.location.href).toBe(before);
  });

  test("two apps at once", async () => {
    const home = await visit(App, "/");
    const about = await visit(App, "/about");

    expect(home.container.querySelector("h1").textContent).toBe("Home");
    expect(about.container.querySelector("h1").textContent).toBe("About");
  });

  test("unmount", async () => {
    const screen = await visit(App, "/");

    await screen.unmount();

    expect(document.body.contains(screen.container)).toBe(false);
    expect(screen.owner.isDestroyed).toBe(true);
  });
});

// These two tests must stay in this order.
describe("visit cleanup between tests", () => {
  test("a test that visits", async () => {
    await visit(App, "/");

    expect(document.body.querySelector("h1")).not.toBeNull();
  });

  test("the next test starts with a clean document", async () => {
    expect(document.body.querySelector("h1")).toBeNull();
  });
});
