import { runHooks, settled } from "@ember/test-helpers";
import { vi } from "vitest";
import {
  page,
  utils,
  type Locator,
  type LocatorSelectors,
} from "vitest/browser";
import { active, ensureTestId, track, type CleanupContext } from "./manual.ts";
import { bootApp, type Booted, type Configure } from "./boot.ts";

import type EmberApplication from "@ember/application";
import type ApplicationInstance from "@ember/application/instance";
import type RouterService from "@ember/routing/router-service";

export interface VisitOptions {
  /**
   * Runs after the app boots and before it visits the URL.
   * For example, register a stub service here.
   */
  configure?: Configure;
  /**
   * The vitest test context.
   * Concurrent tests must pass it, so that the app is torn down
   * when this test finishes, and not when another test finishes.
   */
  context?: CleanupContext;
}

export interface VisitResult extends LocatorSelectors {
  /**
   * The element that the app renders into.
   */
  container: HTMLDivElement;
  locator: Locator;
  /**
   * The booted instance of the app.
   */
  owner: ApplicationInstance;
  /**
   * The URL of the app, from the router service.
   */
  readonly currentURL: string | null;
  /**
   * Navigates the same app to another URL.
   */
  visit: (url: string) => Promise<void>;
  unmount: () => Promise<void>;
}

/**
 * Boots an app into a new element on the page and visits a URL.
 *
 * The app is torn down after the test.
 */
export const visit = vi.defineHelper(
  async (
    App: typeof EmberApplication,
    url: string,
    options: VisitOptions = {},
  ): Promise<VisitResult> => {
    let container = document.createElement("div");
    document.body.append(container);
    ensureTestId(container);

    // The `visit` hooks record the trace mark.
    await runHooks("visit", "start", url);

    let booted: Booted | undefined;

    let visited = {
      disposed: false,
      async [Symbol.asyncDispose]() {
        if (visited.disposed) return;

        visited.disposed = true;
        active.delete(visited);
        booted?.destroy();
        await settled();
        container.remove();
      },
    };

    track(visited, options.context);

    // `location: "none"` keeps the app from changing the URL of the test page.
    booted = await bootApp(App, container, { location: "none" });

    let instance = booted.instance;

    await options.configure?.(instance);
    await instance.visit(url);

    await settled();
    await runHooks("visit", "end", url);

    let router = instance.lookup("service:router") as RouterService;

    return {
      container,
      locator: page.elementLocator(container),
      ...utils.getElementLocatorSelectors(container),
      owner: instance,
      get currentURL() {
        return router.currentURL;
      },
      visit: vi.defineHelper(async (next: string) => {
        await runHooks("visit", "start", next);
        await instance.visit(next);
        await settled();
        await runHooks("visit", "end", next);
      }),
      unmount: () => visited[Symbol.asyncDispose](),
    };
  },
);
