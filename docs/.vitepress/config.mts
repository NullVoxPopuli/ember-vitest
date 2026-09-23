import { defineConfig } from "vitepress";

export default defineConfig({
  title: "ember-vitest",
  description: "Test Ember apps and libraries with vitest browser mode",
  // GitHub Pages serves the site from the repository name.
  base: "/ember-vitest/",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/" },
      // The vitest HTML report is copied into the site at deploy time.
      {
        text: "Test report",
        link: "https://nullvoxpopuli.github.io/ember-vitest/tests/",
      },
    ],
    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Getting started", link: "/guide/" },
          { text: "Setup", link: "/guide/setup" },
          {
            text: "without this library...",
            link: "/guide/vanilla",
          },
        ],
      },
      {
        text: "Core APIs",
        items: [
          { text: "render", link: "/guide/render" },
          { text: "visit", link: "/guide/visit" },
        ],
      },
      {
        text: "Additional testing styles",
        items: [
          {
            text: "Setup contexts",
            link: "/guide/setup-contexts",
            items: [
              { text: "setupContext", link: "/guide/setup-context" },
              {
                text: "setupRenderingContext",
                link: "/guide/setup-rendering-context",
              },
            ],
          },
          {
            text: "Extended test",
            link: "/guide/extended-test",
            items: [
              { text: "test", link: "/guide/test" },
              { text: "renderingTest", link: "/guide/rendering-test" },
              { text: "applicationTest", link: "/guide/application-test" },
            ],
          },
        ],
      },
      {
        text: "Debugging",
        items: [{ text: "Pausing and tracing", link: "/guide/debugging" }],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/NullVoxPopuli/ember-vitest" },
    ],
    search: { provider: "local" },
  },
});
