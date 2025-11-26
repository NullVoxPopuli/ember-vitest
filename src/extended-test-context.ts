import {
  setApplication,
  resumeTest,
  pauseTest,
  type TestContext,
} from "@ember/test-helpers";

// https://vitest.dev/guide/test-context.html#extend-test-context
import { test as baseTest } from "vitest";
import {
  setupContext,
  teardownContext,
  setupRenderingContext,
  setupApplicationContext,
} from "@ember/test-helpers";

import Application from "ember-strict-application-resolver";

import type EmberApplication from "@ember/application";
import type { Owner } from "@ember/test-helpers/build-owner";

globalThis.resumeTest = resumeTest;

class App extends Application {
  modules = {};
}

const waitForSettled = true;
const teardownContextOptions = { waitForSettled };

type ExtendedTestContext = {
  app: typeof EmberApplication;
  element: HTMLElement;
  context: TestContext;
  env: {
    owner: Owner;
    element: HTMLElement;
    pauseTest: () => Promise<void>;
  };
};

export const test = baseTest.extend<ExtendedTestContext>({
  app: ({}, use) => use(App),
  element: ({}, use) => use(document.createElement("div")),
  context: ({}, use) => use({} as TestContext),
  env: [
    async (
      {
        app,
        element,
        context,
      }: {
        app: typeof EmberApplication;
        element: HTMLElement;
        context: TestContext;
      },
      use,
    ) => {
      document.body.append(element);

      setApplication(app.create({ autoboot: false, rootElement: element }));
      await setupContext(context);

      await use({
        owner: context.owner,
        element,
        pauseTest,
      });

      await teardownContext(context, teardownContextOptions);
      element.remove();
    },
    { auto: true },
  ],
});

export const renderingTest = baseTest.extend<ExtendedTestContext>({
  app: ({}, use) => use(App),
  element: ({}, use) => use(document.createElement("div")),
  context: ({}, use) => use({} as TestContext),
  env: [
    async (
      {
        app,
        element,
        context,
      }: {
        app: typeof EmberApplication;
        element: HTMLElement;
        context: TestContext;
      },
      use,
    ) => {
      document.body.append(element);

      setApplication(app.create({ autoboot: false, rootElement: element }));
      await setupContext(context);
      await setupRenderingContext(context);

      await use({
        owner: context.owner,
        element,
        pauseTest,
      });

      await teardownContext(context, teardownContextOptions);
      element.remove();
    },
    { auto: true },
  ],
});

export const applicationTest = baseTest.extend<ExtendedTestContext>({
  app: ({}, use) => use(App),
  element: ({}, use) => use(document.createElement("div")),
  context: ({}, use) => use({} as TestContext),
  env: [
    async (
      {
        app,
        element,
        context,
      }: {
        app: typeof EmberApplication;
        element: HTMLElement;
        context: TestContext;
      },
      use,
    ) => {
      document.body.append(element);

      console.log(app);

      setApplication(app.create({ autoboot: false, rootElement: element }));
      await setupContext(context);
      await setupApplicationContext(context);

      await use({
        owner: context.owner,
        element,
        pauseTest,
      });

      await teardownContext(context, teardownContextOptions);
      element.remove();
    },
    { auto: true },
  ],
});
