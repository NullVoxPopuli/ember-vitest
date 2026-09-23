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

To use services, pass an `owner`. To pass args to a component, pass `args`. If `args` is a tracked object, the component updates when the args change.

```gjs
const screen = await render(Greeting, { owner, args: { name: "there" } });
```

The returned `screen` has:

- `container`, the element that the component renders into
- `locator`, a vitest [locator](https://vitest.dev/api/browser/locators) for `container`
- `getByRole`, `getByText`, `getByTestId` and the other [locator selectors](https://vitest.dev/api/browser/locators), scoped to `container`
- `unmount()`, to remove the render before the test ends

The render is removed after each test.

## Additional testing styles

`render` does not set up an `@ember/test-helpers` test context.
These testing styles set one up:

- [`setupRenderingContext`](./setup-rendering-context)
- [Extended `test`](./extended-test)
