import { runHooks, settled, type TestContext } from "@ember/test-helpers";
import {
  setupContext as emberSetupContext,
  teardownContext,
  setApplication,
} from "@ember/test-helpers";
import { renderComponent } from "@ember/renderer";
import { afterEach, vi, type TestContext as VitestTestContext } from "vitest";
import {
  page,
  server,
  userEvent,
  utils,
  type Locator,
  type LocatorSelectors,
} from "vitest/browser";
import { create } from "./create-app.ts";
import { runHooksWithoutMark } from "./trace-marks.ts";

import type EmberApplication from "@ember/application";
import type ApplicationInstance from "@ember/application/instance";
import type { Owner } from "@ember/test-helpers/build-owner";
import type { ComponentLike } from "@glint/template";

export interface RenderingContext extends LocatorSelectors {
  element: HTMLDivElement;
  readonly owner: Owner;
  locator: Locator;
  find: ParentNode["querySelector"];
  findAll: ParentNode["querySelectorAll"];
  click: (target: string | Element | Locator) => Promise<void>;
  render: (component: ComponentLike<unknown>) => Promise<void>;
  [Symbol.dispose]: () => Promise<void>;
  [Symbol.asyncDispose]: () => Promise<void>;
}

type Disposable = { [Symbol.asyncDispose]: () => Promise<void> };

export const active = new Set<Disposable>();

// Tears down any context a test forgot to dispose.
async function cleanup() {
  for (let context of active) {
    await context[Symbol.asyncDispose]();
  }
}

afterEach(cleanup);

/**
 * The part of the vitest test context that cleanup needs.
 */
export type CleanupContext = Pick<VitestTestContext, "onTestFinished">;

/**
 * Tears down `disposable` when its test finishes.
 *
 * vitest does not tell global hooks which concurrent test is running,
 * so the `afterEach` cleanup disposes the renders of every running test.
 * With the test context, cleanup is scoped to the test that owns it.
 */
export function track(disposable: Disposable, context?: CleanupContext) {
  if (context) {
    context.onTestFinished(() => disposable[Symbol.asyncDispose]());
    return;
  }

  active.add(disposable);
}

export interface Context {
  element: HTMLDivElement;
  /**
   * The booted instance of the app.
   */
  owner: ApplicationInstance;
  [Symbol.asyncDispose]: () => Promise<void>;
}

/**
 * Boots an instance of the app, for tests that need an owner
 * but do not render.
 */
export async function setupContext(
  app?: typeof EmberApplication,
): Promise<Context> {
  let element = document.createElement("div");
  document.body.append(element);

  let application = create(app, element);

  await application.boot();

  let instance = application.buildInstance();

  await instance.boot();

  let context: Context = {
    element,
    owner: instance,
    async [Symbol.asyncDispose]() {
      active.delete(context);
      instance.destroy();
      application.destroy();
      await settled();
      element.remove();
    },
  };

  active.add(context);

  return context;
}

let elementCount = 0;

// Locators serialize an element as a CSS selector.
// A test id keeps that selector stable across re-renders.
export function ensureTestId(element: HTMLElement) {
  let attribute = server.config.browser.locators.testIdAttribute;

  if (!element.hasAttribute(attribute)) {
    element.setAttribute(attribute, `__ember_vitest_${elementCount++}__`);
  }
}

export async function setupRenderingContext(
  app?: typeof EmberApplication,
): Promise<RenderingContext> {
  let element = document.createElement("div");
  document.body.append(element);
  ensureTestId(element);

  let renders: Array<ReturnType<typeof renderComponent>> = [];
  let ctx = {} as TestContext;
  let created = create(app, element);

  setApplication(created);

  await emberSetupContext(ctx);

  // Overloads that match Element.querySelector:
  function find<K extends keyof (HTMLElementTagNameMap | SVGElementTagNameMap)>(
    selector: K,
  ): HTMLElementTagNameMap[K] | SVGElementTagNameMap[K] | null;
  function find<K extends keyof HTMLElementTagNameMap>(
    selector: K,
  ): HTMLElementTagNameMap[K] | null;
  function find<K extends keyof SVGElementTagNameMap>(
    selector: K,
  ): SVGElementTagNameMap[K] | null;
  function find<E extends Element = Element>(selector: string): E | null;
  function find(selector: string) {
    return element.querySelector(selector);
  }

  // Overloads that match Element.querySelectorAll:
  function findAll<K extends keyof HTMLElementTagNameMap>(
    selector: K,
  ): NodeListOf<HTMLElementTagNameMap[K]>;
  function findAll<K extends keyof SVGElementTagNameMap>(
    selector: K,
  ): NodeListOf<SVGElementTagNameMap[K]>;
  function findAll<K extends keyof HTMLElementDeprecatedTagNameMap>(
    selector: K,
  ): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>;
  function findAll<E extends Element = Element>(
    selector: string,
  ): NodeListOf<E>;
  function findAll(selector: string) {
    return element.querySelectorAll(selector);
  }

  let locator = page.elementLocator(element);

  // userEvent goes through the browser provider,
  // so the click is recorded in the trace view.
  // defineHelper makes the trace entry point at the test line.
  // The @ember/test-helpers `click` hooks still run,
  // so hooks registered for `click` see this click too.
  let click = vi.defineHelper(async (target: string | Element | Locator) => {
    let found = typeof target === "string" ? find(target) : target;

    if (!found) {
      throw new Error(`Element not found when calling \`click('${target}')\`.`);
    }

    let element = found instanceof Element ? found : found.element();

    await runHooksWithoutMark("click", "start", element);
    await userEvent.click(element);
    await settled();
    await runHooksWithoutMark("click", "end", element);
  });

  // The `render` hooks record the trace mark.
  // defineHelper makes the trace mark point at the test line.
  let render = vi.defineHelper(async (component: ComponentLike<unknown>) => {
    await runHooks("render", "start");

    let result = renderComponent(component, {
      into: element,
      owner: ctx.owner,
    });

    renders.push(result);
    await settled();
    await runHooks("render", "end");
  });

  let context: RenderingContext = {
    element,
    get owner() {
      return ctx.owner;
    },
    find,
    findAll,
    locator,
    ...utils.getElementLocatorSelectors(element),
    click,
    render,
    async [Symbol.dispose]() {
      active.delete(context);
      renders.forEach((r) => r.destroy());
      await teardownContext(ctx);
      element.remove();
    },
    async [Symbol.asyncDispose]() {
      active.delete(context);
      renders.forEach((r) => r.destroy());
      await settled();
      await teardownContext(ctx);
      await settled();
      element.remove();
    },
  };

  active.add(context);

  return context;
}
