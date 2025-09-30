import { getOwner } from "@ember/owner";
import { settled, click } from "@ember/test-helpers";
import {
  setupContext as emberSetupContext,
  teardownContext,
  setApplication,
} from "@ember/test-helpers";
import { renderComponent } from "@ember/renderer";
import { create as createApp } from "./create-app.js";

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

export async function setupRenderingContext(app) {
  let element = document.createElement("div");
  document.body.append(element);

  let renders = [];
  let ctx = {};
  let created = createApp(app, element);

  setApplication(created);

  await emberSetupContext(ctx);

  return {
    element,
    get owner() {
      return ctx.owner;
    },
    find(selector) {
      return element.querySelector(selector);
    },
    findAll(selector) {
      return element.querySelectorAll(selector);
    },
    click(target) {
      let found = target instanceof Element ? target : this.find(target);

      return click(found);
    },
    async render(component) {
      let result = await renderComponent(component, {
        into: element,
        owner: ctx.owner,
      });

      renders.push(result);
      await settled();
    },
    async [Symbol.dispose]() {
      renders.forEach((r) => r.destroy());
      teardownContext(ctx);
      element.remove();
    },
    async [Symbol.asyncDispose]() {
      renders.forEach((r) => r.destroy());
      await settled();
      teardownContext(ctx);
      await settled();
      element.remove();
    },
  };
}
