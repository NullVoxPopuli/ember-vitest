import EmberRouter from "@ember/routing/router";
import Route from "@ember/routing/route";
import Service, { service } from "@ember/service";
import Component from "@glimmer/component";
import Application from "ember-strict-application-resolver";
import { describe, test, expect } from "vitest";

import { render, visit } from "ember-vitest";

class Router extends EmberRouter {
  rootURL = "/";
}

Router.map(function () {
  this.route("about");
});

class Config extends Service {
  theme = "unset";
  themeSeenByRoute = undefined;
}

// Apps often do their initial setup here.
class ApplicationRoute extends Route {
  @service config;

  beforeModel() {
    this.config.themeSeenByRoute = this.config.theme;

    if (this.config.theme === "unset") {
      this.config.theme = "dark";
    }
  }
}

class App extends Application {
  modules = {
    "./router": Router,
    "./services/config": Config,
    "./routes/application": ApplicationRoute,
    "./templates/application": <template>
      <output>{{outlet}}</output>
    </template>,
    "./templates/about": <template>about</template>,
  };
}

class Theme extends Component {
  @service config;

  <template>
    <output>{{this.config.theme}}</output>
  </template>
}

describe("render with app", () => {
  test("the component gets the services of the app", async () => {
    const screen = await render(Theme, { app: App });

    expect(screen.container.textContent.trim()).toBe("unset");
  });

  test("booting does not enter ApplicationRoute", async () => {
    const screen = await render(Theme, { app: App });

    // With visit, ApplicationRoute sets "dark".
    expect(screen.container.textContent.trim()).not.toBe("dark");
  });

  test("configure runs before the render", async () => {
    const screen = await render(Theme, {
      app: App,
      configure(instance) {
        instance.lookup("service:config").theme = "light";
      },
    });

    expect(screen.container.textContent.trim()).toBe("light");
  });

  test("an async configure is awaited", async () => {
    const screen = await render(Theme, {
      app: App,
      async configure(instance) {
        await new Promise((resolve) => setTimeout(resolve, 20));
        instance.lookup("service:config").theme = "later";
      },
    });

    expect(screen.container.textContent.trim()).toBe("later");
  });

  test("a function that returns the app", async () => {
    const screen = await render(Theme, { app: () => App });

    expect(screen.container.textContent.trim()).toBe("unset");
  });

  test("a booted instance is used and not destroyed", async () => {
    const app = App.create({ autoboot: false });
    await app.boot();
    const instance = app.buildInstance();
    await instance.boot();
    instance.lookup("service:config").theme = "from the instance";

    const screen = await render(Theme, { app: instance });

    expect(screen.container.textContent.trim()).toBe("from the instance");

    await screen.unmount();

    expect(instance.isDestroyed).toBe(false);

    instance.destroy();
    app.destroy();
  });

  test("unmount destroys the app that render booted", async () => {
    let booted;

    const screen = await render(Theme, {
      app: App,
      configure(instance) {
        booted = instance;
      },
    });

    await screen.unmount();

    expect(booted.isDestroyed).toBe(true);
  });

  test("app and owner together throw", async () => {
    await expect(render(Theme, { app: App, owner: {} })).rejects.toThrow(
      "Pass `app` or `owner` to `render`, not both.",
    );
  });

  test("configure without app throws", async () => {
    await expect(render(Theme, { configure() {} })).rejects.toThrow(
      "`configure` needs an `app` to configure.",
    );
  });
});

describe("visit with configure", () => {
  test("configure runs before ApplicationRoute", async () => {
    const screen = await visit(App, "/", {
      configure(instance) {
        instance.lookup("service:config").theme = "stubbed";
      },
    });

    expect(screen.owner.lookup("service:config").themeSeenByRoute).toBe(
      "stubbed",
    );
  });

  test("configure can register a stub service", async () => {
    class StubConfig extends Service {
      theme = "stub";
      themeSeenByRoute = undefined;
    }

    const screen = await visit(App, "/", {
      configure(instance) {
        instance.register("service:config", StubConfig);
      },
    });

    expect(screen.owner.lookup("service:config")).toBeInstanceOf(StubConfig);
    expect(screen.owner.lookup("service:config").themeSeenByRoute).toBe("stub");
  });

  test("without configure, ApplicationRoute runs", async () => {
    const screen = await visit(App, "/");

    expect(screen.owner.lookup("service:config").theme).toBe("dark");
  });

  test("each visit call boots a new app, and screen.visit navigates", async () => {
    const first = await visit(App, "/");
    const second = await visit(App, "/about");

    expect(second.owner).not.toBe(first.owner);
    expect(first.currentURL).toBe("/");

    await first.visit("/about");

    expect(first.currentURL).toBe("/about");
  });
});
