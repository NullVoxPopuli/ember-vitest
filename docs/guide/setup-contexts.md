# Setup contexts

The setup context functions return a context object that the test disposes with `await using`.
The context has an element and an owner from your app.

- [`setupContext`](./setup-context), for an owner to look up services, without rendering
- [`setupRenderingContext`](./setup-rendering-context), for rendering with `@ember/test-helpers`

::: warning
Tests that use `setupRenderingContext` cannot run in parallel.
It calls `setApplication` and `setupContext` from `@ember/test-helpers`, and both store their state in global variables.
Parallel tests overwrite the state of each other.
:::

`setupContext` does not use these global variables.
