# ember-vitest

ember <-> vitest integration

- browser testing is first class
- pause test execution for UI debugging purposes (and without pausing JS execution)
- continue using familiar helpers as you would in qunit

## Install

```bash
npm add --save-dev ember-vitest vitest @vitest/browser @vitest/browser-webdriverio
```

Then configure vite. See [Setup](https://nullvoxpopuli.github.io/ember-vitest/guide/setup).

## Usage

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

The [documentation](https://nullvoxpopuli.github.io/ember-vitest/) has:

- [Vanilla Vitest (Vitest without this library)](https://nullvoxpopuli.github.io/ember-vitest/guide/vanilla)
- Core APIs: [`render`](https://nullvoxpopuli.github.io/ember-vitest/guide/render) and [`visit`](https://nullvoxpopuli.github.io/ember-vitest/guide/visit)
- Additional testing styles: [`setupRenderingContext`](https://nullvoxpopuli.github.io/ember-vitest/guide/setup-rendering-context) and the [extended `test`](https://nullvoxpopuli.github.io/ember-vitest/guide/extended-test)

The [test report](https://nullvoxpopuli.github.io/ember-vitest/tests/) of this repository has the result and the trace of each test.
