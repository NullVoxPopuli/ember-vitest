import {
  setApplication,
  resumeTest,
  pauseTest,
  setupContext,
  teardownContext,
  setupRenderingContext,
  setupApplicationContext,
  type TestContext,
} from "@ember/test-helpers";

// https://vitest.dev/guide/test-context.html#builder-pattern
import { test as baseTest } from "vitest";

import Application from "ember-strict-application-resolver";

import "./trace-marks.ts";

import type EmberApplication from "@ember/application";

globalThis.resumeTest = resumeTest;

class App extends Application {
  modules = {};
}

const waitForSettled = true;
const teardownContextOptions = { waitForSettled };

type Setup = (context: TestContext) => Promise<unknown>;

// `setup` picks which @ember/test-helpers context the test gets.
function emberTest(setup?: Setup) {
  return baseTest
    .extend("app", (): typeof EmberApplication => App)
    .extend("element", () => document.createElement("div"))
    .extend("context", () => ({}) as TestContext)
    .extend(
      "env",
      { auto: true },
      async ({ app, element, context }, { onCleanup }) => {
        document.body.append(element);

        setApplication(app.create({ autoboot: false, rootElement: element }));
        await setupContext(context);
        await setup?.(context);

        onCleanup(async () => {
          await teardownContext(context, teardownContextOptions);
          element.remove();
        });

        return {
          owner: context.owner,
          element,
          pauseTest,
        };
      },
    );
}

export const test = emberTest();
export const renderingTest = emberTest(setupRenderingContext);
export const applicationTest = emberTest(setupApplicationContext);
