import { getOwner } from "@ember/owner";
import { settled, click, type TestContext } from "@ember/test-helpers";
import {
  setupContext as emberSetupContext,
  teardownContext,
  setApplication,
  type Target,
} from "@ember/test-helpers";
import { renderComponent } from "@ember/renderer";
import { create, createApp } from "./create-app.ts";

import type EmberApplication from "@ember/application";
import type Component from "@glimmer/component";
import type TOC from "@ember/component/template-only";

export function setupContext() {
  let element = document.createElement("div");
  document.body.append(element);
  const app = createApp(element);

  return {
    element,
    get owner() {
      return getOwner(app);
    },
    async [Symbol.asyncDispose]() {
      app.destroy();
      await settled();
      element.remove();
    },
  };
}

export async function setupRenderingContext(app: typeof EmberApplication) {
  let element = document.createElement("div");
  document.body.append(element);

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

  return {
    element,
    get owner() {
      return ctx.owner;
    },
    find,
    findAll,
    click(target: Parameters<typeof click>[0]) {
      return click(target);
    },
    async render(
      component: (new (...args: unknown[]) => Component) | typeof TOC,
    ) {
      let result = renderComponent(component, {
        into: element,
        owner: ctx.owner,
      });

      renders.push(result);
      await settled();
    },
    async [Symbol.dispose]() {
      renders.forEach((r) => r.destroy());
      await teardownContext(ctx);
      element.remove();
    },
    async [Symbol.asyncDispose]() {
      renders.forEach((r) => r.destroy());
      await settled();
      await teardownContext(ctx);
      await settled();
      element.remove();
    },
  };
}
