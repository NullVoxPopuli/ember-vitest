import type EmberApplication from "@ember/application";
import type ApplicationInstance from "@ember/application/instance";
import type { BootOptions } from "@ember/engine/instance";

/**
 * An app class, a booted app instance, or a function that returns either.
 *
 * The same shape as the `app` parameter of ember-storybook.
 */
export type AppParameter =
  | typeof EmberApplication
  | ApplicationInstance
  | ((
      options?: Record<string, unknown>,
    ) => typeof EmberApplication | ApplicationInstance);

/**
 * Runs after the app instance boots.
 *
 * Booting does not enter `ApplicationRoute`,
 * so setup that an app does there must happen here.
 */
export type Configure = (instance: ApplicationInstance) => void | Promise<void>;

export interface Booted {
  instance: ApplicationInstance;
  /**
   * Destroys what `bootApp` created. An instance that the caller passed in
   * belongs to the caller, so it is not destroyed.
   */
  destroy: () => void;
}

function isAppClass(app: unknown): app is typeof EmberApplication {
  return typeof app === "function" && "create" in app;
}

export async function bootApp(
  app: AppParameter,
  element: HTMLElement,
  bootOptions?: BootOptions,
): Promise<Booted> {
  let resolved = typeof app === "function" && !isAppClass(app) ? app() : app;

  if (!isAppClass(resolved)) {
    await resolved.boot(bootOptions);

    return { instance: resolved, destroy() {} };
  }

  let application = resolved.create({ autoboot: false, rootElement: element });

  await application.boot();

  let instance = application.buildInstance();

  await instance.boot(bootOptions);

  return {
    instance,
    destroy() {
      instance.destroy();
      application.destroy();
    },
  };
}
