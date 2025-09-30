import Application from "ember-strict-application-resolver";

class App extends Application {
  modules = {};
}

export function createApp(element) {
  return App.create({ autoboot: false, rootElement: element });
}

export function create(app, element) {
  if (app) {
    return app.create({ autoboot: false, rootElement: element });
  }

  return createApp(element);
}
