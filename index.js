import { setApplication, resumeTest, pauseTest } from "@ember/test-helpers";
import { assert } from '@ember/debug';

// https://vitest.dev/guide/test-context.html#extend-test-context
import { test as baseTest } from "vitest";
import {
  setupContext,
  teardownContext,
  setupRenderingContext,
  setupApplicationContext,
} from "@ember/test-helpers";

import Application from "ember-strict-application-resolver";

globalThis.resumeTest = resumeTest;

class App extends Application {
  modules = {};
}

const waitForSettled = true;
const options = { waitForSettled };
export const renderingTest = baseTest.extend({
  // app: ({ }, use) => use({}),
  env: [
    async ({ app }, use) => {
      let context = {};
      let testElement = document.createElement("div");
      document.body.append(testElement);

      setApplication(
        app
          ? app.create({ autoboot: false, rootElement: testElement })
          : App.create({ autoboot: false, rootElement: testElement }),
      );
      await setupContext(context, options);
      await setupRenderingContext(context, options);

      await use({
        owner: context.owner,
        element: testElement,
        pauseTest,
      });

      await teardownContext(context, options);
      testElement.remove();
    },
    { auto: true },
  ],
});

export const applicationTest = baseTest.extend({
  // app: ({ app }, use) => use({ app }),
  env: [
    async ({ app }, use) => {
      let testElement = document.createElement("div");
      document.body.append(testElement);
      let context = {};

      setApplication(
        app
          ? app.create({ autoboot: false, rootElement: testElement })
          : App.create({ autoboot: false, rootElement: testElement }),
      );
      await setupContext(context, options);
      await setupApplicationContext(context, options);

      await use({
        owner: context.owner,
        element: testElement,
        pauseTest,
      });

      await teardownContext(context, options);
      testElement.remove();
    },
    { auto: true },
  ],
});
