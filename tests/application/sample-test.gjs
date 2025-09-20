import { describe, it, expect } from 'vitest';
import { applicationTest } from 'ember-vitest';
import { visit, pauseTest } from '@ember/test-helpers';

import EmberRouter from '@ember/routing/router';
import Application from "ember-strict-application-resolver";

class Router extends EmberRouter {
  location = 'none';
  rootUrl = '/';
} 

describe("Home", () => {
  applicationTest.scoped({ app: class App extends Application {
    modules = {
      './router': Router,
      './templates/application': <template>hello there</template>,
    }
  } });

    applicationTest('can visit the home screen', async ({ env: { root } }) => {
      await visit('/');

      expect(root.textContent).toBe('hello there');
    });
});
