import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
import Application from "ember-strict-application-resolver";
import { describe, test, expect } from "vitest";

import { setupContext } from "ember-vitest";

class Counter extends Service {
  @tracked count = 0;
}

class App extends Application {
  modules = {
    "./services/counter": Counter,
  };
}

describe("setupContext", () => {
  test("the owner looks up services of the app", async () => {
    await using ctx = await setupContext(App);

    let counter = ctx.owner.lookup("service:counter");

    expect(counter.count).toBe(0);
    counter.count++;
    expect(ctx.owner.lookup("service:counter").count).toBe(1);
  });

  test("without an app, the owner still works", async () => {
    await using ctx = await setupContext();

    expect(ctx.owner.lookup("service:router")).toBeTruthy();
  });

  test("each context has its own instance", async () => {
    await using a = await setupContext(App);
    await using b = await setupContext(App);

    a.owner.lookup("service:counter").count = 5;

    expect(b.owner.lookup("service:counter").count).toBe(0);
  });

  test("dispose destroys the owner", async () => {
    let owner;

    {
      await using ctx = await setupContext(App);
      owner = ctx.owner;
    }

    expect(owner.isDestroyed).toBe(true);
  });
});
