# Getting started

```bash
npm add --save-dev ember-vitest vitest @vitest/browser @vitest/browser-webdriverio
```

Then configure vite. See [Setup](./setup).

## Write a test

Use [`render`](./render) to render a component and get locators for it:

```gjs
import { describe, expect, test } from "vitest";
import { render } from "ember-vitest";

import { Button } from "#src/components/ui/button.gts";

describe("Button", () => {
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

::: tip
Use [`expect.soft`](https://vitest.dev/api/expect.html#soft) to see all of the failed assertions of a test at once, not only the first one:

```js
import { expect as hardExpect } from "vitest";

const expect = hardExpect.soft;
```

`expect.soft` has no `element`, so use `hardExpect.element` for locators.
:::

## Run the tests

```bash
pnpm vitest
# or
npm exec vitest
```

## Where to go next

- [Vanilla Vitest](./vanilla) shows a test without this library, so you can see what `render` does for you.
- [Core APIs](./render) are the APIs that most tests need.
- [Additional testing styles](./setup-rendering-context) integrate with `@ember/test-helpers` and with the owner of your app.
