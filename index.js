// https://vitest.dev/guide/test-context.html#extend-test-context
import { beforeEach, afterEach, test as baseTest } from 'vitest';
import {
  setupContext,
  teardownContext,
  setupRenderingContext,
  setupApplicationContext,
  validateErrorHandler,
} from '@ember/test-helpers';

const waitForSettled = true;
const options = { waitForSettled };
export const renderingTest = baseTest.extend({
  owner: [async ({ }, use) => {
    let context = {};
    await setupContext(context, options);
    await setupRenderingContext(context, options);

    await use(context.owner);

    await teardownContext(context, options);

  }, { auto: true }],
});
