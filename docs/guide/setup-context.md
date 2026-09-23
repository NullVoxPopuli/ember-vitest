# `setupContext`

`setupContext` boots an instance of your app and returns it as `owner`.
Use the owner to look up services and other objects of your app, or to interact with the app instance.

```gjs
import { describe, test, expect } from "vitest";
import { setupContext } from "ember-vitest";

import App from "#app/app";

describe("session service", () => {
  test("starts signed out", async () => {
    await using ctx = await setupContext(App);

    let session = ctx.owner.lookup("service:session");

    expect(session.isSignedIn).toBe(false);
  });
});
```

## Why choose it

Choose `setupContext` when a test needs an owner but does not render and does not visit a URL.

- Each call boots a separate app instance, so state does not leak between tests.
- It does not set up an `@ember/test-helpers` context. The helpers that render or visit do not apply to these tests.
- To render, use [`render`](./render) with `{ owner: ctx.owner }`, or use [`setupRenderingContext`](./setup-rendering-context).

If you pass no app, `setupContext` boots an empty app.

## The context

The context has:

- `element`, the root element of the app
- `owner`, the booted app instance

If a test does not dispose its context, the context is torn down after that test.
