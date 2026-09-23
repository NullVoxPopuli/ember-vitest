import { renderComponent } from "@ember/renderer";
import { runHooks, settled } from "@ember/test-helpers";
import { vi } from "vitest";
import {
  page,
  utils,
  type Locator,
  type LocatorSelectors,
} from "vitest/browser";
import { active, ensureTestId, track, type CleanupContext } from "./manual.ts";
import {
  bootApp,
  type AppParameter,
  type Booted,
  type Configure,
} from "./boot.ts";

import type { ComponentLike } from "@glint/template";

export interface RenderOptions {
  /**
   * The owner for services and other injections.
   * Do not pass it together with `app`.
   */
  owner?: object;
  /**
   * The app to boot. Its instance becomes the owner.
   */
  app?: AppParameter;
  /**
   * Runs after `app` boots and before the render.
   * Booting does not enter `ApplicationRoute`,
   * so setup that the app does there must happen here.
   */
  configure?: Configure;
  /**
   * Args for the component. A tracked object keeps them reactive.
   */
  args?: Record<string, unknown>;
  /**
   * The vitest test context.
   * Concurrent tests must pass it, so that the render is torn down
   * when this test finishes, and not when another test finishes.
   */
  context?: CleanupContext;
}

export interface RenderResult extends LocatorSelectors {
  /**
   * The element that the component renders into.
   */
  container: HTMLDivElement;
  locator: Locator;
  unmount: () => Promise<void>;
}

/**
 * Renders a component into a new element on the page.
 *
 * The render is torn down after the test.
 */
export const render = vi.defineHelper(
  async (
    component: ComponentLike<unknown>,
    options: RenderOptions = {},
  ): Promise<RenderResult> => {
    let container = document.createElement("div");
    document.body.append(container);
    ensureTestId(container);

    if (options.app && options.owner) {
      throw new Error("Pass `app` or `owner` to `render`, not both.");
    }

    if (options.configure && !options.app) {
      throw new Error("`configure` needs an `app` to configure.");
    }

    // The `render` hooks record the trace mark.
    await runHooks("render", "start");

    let result: ReturnType<typeof renderComponent> | undefined;
    let booted: Booted | undefined;

    let rendered = {
      disposed: false,
      async [Symbol.asyncDispose]() {
        if (rendered.disposed) return;

        rendered.disposed = true;
        active.delete(rendered);
        result?.destroy();
        booted?.destroy();
        await settled();
        container.remove();
      },
    };

    track(rendered, options.context);

    let owner = options.owner;

    if (options.app) {
      booted = await bootApp(options.app, container);
      await options.configure?.(booted.instance);
      owner = booted.instance;
    }

    result = renderComponent(component, {
      into: container,
      owner,
      args: options.args,
    });

    await settled();
    await runHooks("render", "end");

    return {
      container,
      locator: page.elementLocator(container),
      ...utils.getElementLocatorSelectors(container),
      unmount: () => rendered[Symbol.asyncDispose](),
    };
  },
);
