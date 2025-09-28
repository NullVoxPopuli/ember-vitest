import { getOwner } from "@ember/owner";
import { settled } from "@ember/test-helpers";
import { renderComponent } from "@ember/renderer";

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
export function setupRenderingContext() {
  let element = document.createElement("div");
  document.body.append(element);

  let renders = [];
  let apps = [];
  let defaultOwner = {
    lookup(locator) {
      throw new Error(
        `Will not find ${locator}. You will need to pass an app or owner to render()`,
      );
    },
  };

  return {
    element,
    get owner() {
      return null;
    },
    async render(component, options) {
      let { app, owner: userOwner } = options ?? {};
      let owner = userOwner ?? defaultOwner;

      if (app) {
        let instance = app.create({ autoboot: false, element });
        apps.push(instance);

        owner = getOwner(instance);
      }

      renderComponent(component, { into: element, owner });
      await settled();
    },
    async [Symbol.dispose]() {
      renders.forEach((r) => r.destroy());
      apps.forEach((r) => r.destroy());
      element.remove();
    },
    async [Symbol.asyncDispose]() {
      renders.forEach((r) => r.destroy());
      await settled();
      apps.forEach((r) => r.destroy());
      await settled();
      element.remove();
    },
  };
}
