import { registerHook, runHooks } from "@ember/test-helpers";
import { page } from "vitest/browser";

import type { HookLabel } from "@ember/test-helpers/helper-hooks";

// Vitest only records its own userEvent and locator actions in the trace view.
// These hooks add an entry for each @ember/test-helpers helper as well.
const HELPERS = [
  "blur",
  "click",
  "doubleClick",
  "fillIn",
  "focus",
  "render",
  "scrollTo",
  "select",
  "tab",
  "tap",
  "triggerEvent",
  "triggerKeyEvent",
  "typeIn",
  "visit",
];

let silenced = 0;

/**
 * Runs the @ember/test-helpers hooks for a helper without a trace mark.
 *
 * For helpers that vitest already records, such as `userEvent.click`,
 * a mark would show the same action twice.
 */
export async function runHooksWithoutMark(
  helperName: string,
  label: HookLabel,
  ...args: unknown[]
) {
  silenced++;

  try {
    await runHooks(helperName, label, ...args);
  } finally {
    silenced--;
  }
}

function describeArg(value: unknown): string | undefined {
  if (typeof value === "string") return JSON.stringify(value);
  if (value instanceof Element) return value.tagName.toLowerCase();
  if (value instanceof Window) return "window";
  if (value instanceof Document) return "document";

  return undefined;
}

function markName(helperName: string, args: unknown[]) {
  let described = args.map(describeArg).filter((x) => x !== undefined);

  if (described.length === 0) return `ember.${helperName}`;

  return `ember.${helperName}(${described.join(", ")})`;
}

for (let helperName of HELPERS) {
  registerHook(helperName, "start", (...args: unknown[]) => {
    if (silenced) return;

    // @ember/test-helpers runs hooks from a promise chain,
    // so a mark for its own helpers cannot point at the test line.
    return page.mark(markName(helperName, args), { kind: "action" });
  });
}
