# Pausing and tracing

## Pausing a test

`pauseTest` and `resumeTest` work the same as they do in QUnit.
The page stays interactive while the test is paused.

vitest does not let a test change its own timeout.
A paused test stops when the test timeout ends.
To debug for longer, increase `testTimeout` in the vite config:

```js
export default defineConfig({
  test: {
    testTimeout: 10 * 60 * 1000, // 10 minutes
    // ...
  },
});
```

## Trace view

Turn on the vitest [trace view](https://vitest.dev/guide/browser/trace-view) with `browser.traceView`.
Each Ember render and helper then shows as an entry in the trace:

- `render` and `ctx.render` record an `ember.render` entry.
- The `@ember/test-helpers` helpers (`fillIn`, `triggerEvent`, `visit`, and the rest) record an entry through their [hooks](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#registerhook).
- `ctx.click` goes through `userEvent`, which vitest records.

`ctx.click`, `ctx.render`, and `render` run the `click` and `render` hooks.
A hook that you register with `registerHook` sees them too.

The [test report](https://nullvoxpopuli.github.io/ember-vitest/tests/) of this repository has the trace for each test.
