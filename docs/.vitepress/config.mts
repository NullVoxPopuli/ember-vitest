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
          { text: "Ways to test", link: "/guide/" },
          { text: "Setup", link: "/guide/setup" },
        ],
      },
      {
        text: "Ways to test",
        items: [
          { text: "Vanilla vitest", link: "/guide/vanilla" },
          { text: "render", link: "/guide/render" },
          {
            text: "setupRenderingContext",
            link: "/guide/setup-rendering-context",
          },
          { text: "Extended test", link: "/guide/extended-test" },
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
