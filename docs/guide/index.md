# Ways to test

```bash
npm add --save-dev ember-vitest vitest @vitest/browser @vitest/browser-webdriverio
```

Then configure vite. See [Setup](./setup).

ember-vitest supports four ways to write a test.
Each way removes more boilerplate than the one before it.

| Way                                                  | What you write                                           | Use it when                                                    |
| ---------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------- |
| [Vanilla vitest](./vanilla)                          | The element, the render, and the cleanup                 | You want no abstraction, or you want to see what the others do |
| [`render`](./render)                                 | One call that returns locators                           | You test components                                            |
| [`setupRenderingContext`](./setup-rendering-context) | A context with `render`, `click`, `find`, and an `owner` | You render more than once in a test, or you need an app owner  |
| [Extended `test`](./extended-test)                   | A test function that sets up the app for you             | You visit routes, or you use the `@ember/test-helpers` globals |

## Run the tests

```bash
pnpm vitest
# or
npm exec vitest
```
