import { describe, it, expect } from "vitest";
import { test } from "ember-vitest";
import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

class Foo extends Service {
  @tracked count = 0;
}

import Application from "ember-strict-application-resolver";

class App extends Application {
  modules = {
    "./services/foo": Foo,
  };
}

describe("Container", () => {
  test.scoped({ app: ({}, use) => use(App) });

  test("works", async ({ context }) => {
    let foo = context.owner.lookup("service:foo");

    expect(foo.count).toBe(0);
    foo.count++;
    expect(foo.count).toBe(1);
  });
});
