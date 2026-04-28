// Type-only test. This file is exercised by `pnpm types:check` (ember-tsc).
// It locks in the consumer contract for `setupRenderingContext().render(...)`.
//
// In particular, a bare `<template>...</template>` expression evaluates to a
// `TemplateOnlyComponent` value, and must be accepted by `render`.

import Component from "@glimmer/component";
import { setupRenderingContext } from "ember-vitest";

// Inline `<template>...</template>` expression.
async function inlineTemplateExpression() {
  using ctx = await setupRenderingContext();
  await ctx.render(<template>hello there</template>);
}

// `<template>` assigned to a const, then passed in.
const Greeting = <template>hello there</template>;
async function templateConst() {
  using ctx = await setupRenderingContext();
  await ctx.render(Greeting);
}

// Class component with an embedded `<template>`.
class Counter extends Component {
  count = 0;

  <template>
    <output>{{this.count}}</output>
  </template>
}

async function classComponent() {
  using ctx = await setupRenderingContext();
  await ctx.render(<template><Counter /></template>);
  await ctx.render(Counter);
}

// Suppress "declared but never read" for the helpers; they exist solely so
// ember-tsc can typecheck the bodies above.
export { inlineTemplateExpression, templateConst, classComponent };
