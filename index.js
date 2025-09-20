import { setApplication, resumeTest, pauseTest } from "@ember/test-helpers";

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
  app: ({}, use) => use(App),
  element: ({}, use) => use(document.createElement("div")),
  context: ({}, use) => use({}),
  env: [
    async ({ app, element, context }, use) => {
      document.body.append(element);

      setApplication(app.create({ autoboot: false, rootElement: element }));
      await setupContext(context, options);
      await setupRenderingContext(context, options);

      await use({
        owner: context.owner,
        element,
        pauseTest,
      });

      await teardownContext(context, options);
      element.remove();
    },
    { auto: true },
  ],
});

export const applicationTest = baseTest.extend({
  app: ({}, use) => use(App),
  element: ({}, use) => use(document.createElement("div")),
  context: ({}, use) => use({}),
  env: [
    async ({ app, element, context }, use) => {
      document.body.append(element);

      console.log(app);

      setApplication(app.create({ autoboot: false, rootElement: element }));
      await setupContext(context, options);
      await setupApplicationContext(context, options);

      await use({
        owner: context.owner,
        element,
        pauseTest,
      });

      await teardownContext(context, options);
      element.remove();
    },
    { auto: true },
  ],
});
