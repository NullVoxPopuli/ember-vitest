# `visit`

`visit` boots your app into a new element, visits a URL, and waits for Ember to settle.
It returns vitest [locator selectors](https://vitest.dev/api/browser/locators) scoped to that element.

::: warning
`visit` is not compatible with `@ember/test-helpers`.
For compatibility with `@ember/test-helpers`, use one of the [additional testing styles](#additional-testing-styles).
:::

```gjs
import { describe, expect, test } from "vitest";
import { visit } from "ember-vitest";

import App from "#app/app";

describe("Home", () => {
  test("links to the about page", async () => {
    const screen = await visit(App, "/");

    await screen.getByRole("link", { name: "About" }).click();

    await expect
      .element(screen.getByRole("heading"))
      .toHaveTextContent("About");
    expect(screen.currentURL).toBe("/about");
  });
});
```

The app uses `location: "none"`, so the URL of the test page does not change.
Each call to `visit` boots a separate app, so one test can boot more than one app.

The returned `screen` has:

- `container`, the element that the app renders into
- `owner`, the booted app instance, for example to look up services
- `currentURL`, the URL of the app
- `visit(url)`, to navigate the same app to another URL
- `locator`, a vitest [locator](https://vitest.dev/api/browser/locators) for `container`
- `getByRole`, `getByText`, `getByTestId` and the other [locator selectors](https://vitest.dev/api/browser/locators), scoped to `container`
- `unmount()`, to tear down the app before the test ends

The app is torn down after each test.

## Additional testing styles

`visit` does not set up an `@ember/test-helpers` test context.
These testing styles set one up:

- [`setupRenderingContext`](./setup-rendering-context)
- [Extended `test`](./extended-test), with `applicationTest` for application tests
