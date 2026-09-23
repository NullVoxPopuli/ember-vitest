# `render`

`render` creates the element, renders the component into it, and waits for Ember to settle.
It returns vitest [locator selectors](https://vitest.dev/api/browser/locators) scoped to that element.

::: warning
`render` is not compatible with `@ember/test-helpers`.
For compatibility with `@ember/test-helpers`, use one of the [additional testing styles](#additional-testing-styles).
:::

```gjs
import { describe, expect, test } from "vitest";
import { render } from "ember-vitest";

import { Button } from "#src/components/ui/button.gts";

describe("Rendering | component | ui | button", () => {
  test("forwards native disabled behavior", async () => {
    const screen = await render(
      <template>
        <Button disabled>Unavailable</Button>
      </template>,
    );

    await expect
      .element(screen.getByRole("button", { name: "Unavailable" }))
      .toBeDisabled();
  });
});
```

To pass args to a component, pass `args`. If `args` is a tracked object, the component updates when the args change.

```gjs
const screen = await render(Greeting, { args: { name: "there" } });
```

## Services of your app

To use the services of your app, pass `app`. `render` boots the app and uses its instance as the owner.
`app` takes an app class, a booted app instance, or a function that returns either.

```gjs
import App from "#app/app";

const screen = await render(Greeting, { app: App });
```

`configure` runs after the app boots and before the render. It gets the app instance, and it can be async:

```gjs
const screen = await render(Greeting, {
  app: App,
  async configure(instance) {
    await instance.lookup("service:config").load();
  },
});
```

`app` and `configure` have the same shape as the parameters of [ember-storybook](https://github.com/ember-integrations/ember-storybook), so the same setup code works in both.

To pass an owner that you made yourself, pass `owner` in place of `app`.

::: warning
Booting an app does not enter `ApplicationRoute`.
If your app does its setup in `ApplicationRoute`, for example in `beforeModel`, that setup does not run with `render`.
Do that setup in `configure`, or move it to [runtime configuration](https://gossi.github.io/ember-fireplace/guides/config/runtime.html).
:::

The returned `screen` has:

- `container`, the element that the component renders into
- `locator`, a vitest [locator](https://vitest.dev/api/browser/locators) for `container`
- `getByRole`, `getByText`, `getByTestId` and the other [locator selectors](https://vitest.dev/api/browser/locators), scoped to `container`
- `unmount()`, to remove the render before the test ends

The render is removed after each test. An app that `render` booted is destroyed with it. An app instance that you pass in is not destroyed.

## Parallel tests

In a concurrent test, pass the test context as `{ context }`.
See [Parallel tests](./parallel).

## Additional testing styles

`render` does not set up an `@ember/test-helpers` test context.
These testing styles set one up:

- [`setupRenderingContext`](./setup-rendering-context)
- [Extended `test`](./extended-test)
