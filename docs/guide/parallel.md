# Parallel tests

[`render`](./render) and [`visit`](./visit) support [concurrent tests](https://vitest.dev/api/test#test-concurrent).
In a concurrent test, pass the test context to `render` or `visit`, and assert with `context.expect`:

```gjs
import { describe, test } from "vitest";
import { render } from "ember-vitest";

import { Button } from "#src/components/ui/button.gts";

describe.concurrent("Button", () => {
  test("forwards native disabled behavior", async (context) => {
    const screen = await render(
      <template>
        <Button disabled>Unavailable</Button>
      </template>,
      { context },
    );

    const button = screen.getByRole("button", { name: "Unavailable" });

    await context.expect.poll(() => button.element().disabled).toBe(true);
  });
});
```

`visit` takes the context as its third argument: `visit(App, "/", { context })`.

vitest runs no more than [`maxConcurrency`](https://vitest.dev/config/maxconcurrency) concurrent tests at the same time.
The [Setup](./setup) config sets it to `1`. Increase it to run concurrent tests at the same time.

## Why the test context is necessary

vitest does not tell global hooks or the global `expect` which concurrent test is running.
This is a limit of vitest, and the test context is the solution that vitest gives.

- Without the context, `render` and `visit` clean up in `afterEach`, which cannot tell the tests apart. When one concurrent test finishes, it tears down the renders of the tests that still run. With the context, each test tears down only its own renders.
- The global `expect.element` and `expect.poll` fail with "expect.poll() must be called inside a test" after another concurrent test finishes. Use `context.expect` and `context.expect.poll`. `context.expect` has no `element`.

## Styles that cannot run in parallel

[`setupRenderingContext`](./setup-rendering-context) and the [extended `test`](./extended-test) use global variables from `@ember/test-helpers`.
Do not use them in concurrent tests.
See the warning in [Setup contexts](./setup-contexts).
