import Application from "ember-strict-application-resolver";
import type EmberApplication from "@ember/application";

class App extends Application {
  modules = {};
}

export function createApp(element: HTMLElement) {
  return App.create({ autoboot: false, rootElement: element });
}

export function create(
  app: typeof EmberApplication | undefined,
  element: HTMLElement,
) {
  if (app) {
    return app.create({ autoboot: false, rootElement: element });
  }

  return createApp(element);
}
