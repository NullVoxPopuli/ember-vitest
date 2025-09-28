import { describe, it, expect } from "vitest";
import { applicationTest } from "ember-vitest";
import { visit, pauseTest } from "@ember/test-helpers";

import EmberRouter from "@ember/routing/router";
import Application from "ember-strict-application-resolver";

class Router extends EmberRouter {
  location = "none";
  rootUrl = "/";
}

class App extends Application {
  modules = {
    "./router": Router,
    "./templates/application": <template>hello there</template>,
  };
}

describe("Home", () => {
  applicationTest.scoped({ app: ({}, use) => use(App) });

  applicationTest("can visit the home screen", async ({ element, env }) => {
    await visit("/");

    expect(element.textContent).toBe("hello there");
  });
});
