# Extended `test`

`applicationTest`, `renderingTest`, and `test` set up your app and an `@ember/test-helpers` context before each test.
They match `setupApplicationTest`, `setupRenderingTest`, and `setupTest` from QUnit.

## Why choose it

Choose the extended `test` over [`render`](./render), [`visit`](./visit), and [`setupRenderingContext`](./setup-rendering-context) for these reasons:

- All of `@ember/test-helpers` works, including `render`, `visit`, and `currentURL`.
- Test helpers that libraries build on `@ember/test-helpers` work as they do in QUnit. `@ember/test-helpers` does not depend on a test framework, so a library does not need a vitest version of its helpers.
- Tests that you move from QUnit need the fewest changes.

::: warning
These functions are an experiment, and semver does not cover them.
Tests that use them cannot run in parallel, because `setApplication` from `@ember/test-helpers` is global.
:::

## The functions

- [`applicationTest`](./application-test), for routes and user flows
- [`renderingTest`](./rendering-test), for components
- [`test`](./test), for code that needs the owner but does not render

## The test context

The test callback gets these values:

```js
`renderingTest|applicationTest|test`(
  "name of your test here",
  ({
    // The element that the component or application renders into.
    element,
    // The test context. It has only the owner.
    context: { owner },
    // The internal test setup.
    // env.owner is context.owner, and env.element is element.
    env: { owner, element, pauseTest },
  }) => {},
);
```
