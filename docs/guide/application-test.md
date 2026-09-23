# `applicationTest`

`applicationTest` boots your app and sets up the same `@ember/test-helpers` context as `setupApplicationTest` in QUnit.
Use application tests to visit routes and follow user flows.

This is one of the [extended `test`](./extended-test) functions. See that page for why to choose them and for the values that the test callback gets.

```gjs
// tests/application/sample-test.gjs
import { describe, expect } from "vitest";
import { applicationTest } from "ember-vitest";
import { visit } from "@ember/test-helpers";

import App from "./your/app/location";

describe("Home", () => {
  applicationTest.override("app", () => App);

  applicationTest("can visit the home screen", async ({ element }) => {
    await visit("/");

    expect(element.textContent).toBe("hello there");
  });
});
```
