# `test`

`test` sets up the same `@ember/test-helpers` context as `setupTest` in QUnit.
Use container tests like unit tests, when the code needs the owner of your app.

This is one of the [extended `test`](./extended-test) functions. See that page for why to choose them and for the values that the test callback gets.

```gjs
import { describe, expect } from "vitest";
import { test } from "ember-vitest";

import App from "./your/app/location";

describe("Container test", () => {
  test.override("app", () => App);

  test("can interact", async ({ context }) => {
    let foo = context.owner.lookup("service:foo");

    expect(foo.count).toBe(0);
    foo.count++;
    expect(foo.count).toBe(1);
  });
});
```
