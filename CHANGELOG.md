# Changelog

## Release (2026-09-23)

* ember-vitest 0.8.0 (minor)

#### :rocket: Enhancement
* `ember-vitest`
  * [#69](https://github.com/NullVoxPopuli/ember-vitest/pull/69) Support concurrent tests in render and visit with the test context ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))
  * [#65](https://github.com/NullVoxPopuli/ember-vitest/pull/65) Add a standalone visit for application tests ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))
  * [#60](https://github.com/NullVoxPopuli/ember-vitest/pull/60) Add a standalone render that returns locator selectors ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))

#### :bug: Bug Fix
* `ember-vitest`
  * [#66](https://github.com/NullVoxPopuli/ember-vitest/pull/66) Fix setupContext owner and list every testing style in the nav ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))

#### :memo: Documentation
* `ember-vitest`
  * [#69](https://github.com/NullVoxPopuli/ember-vitest/pull/69) Support concurrent tests in render and visit with the test context ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))
  * [#70](https://github.com/NullVoxPopuli/ember-vitest/pull/70) Rename the vanilla sidebar entry to "without this library..." ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))
  * [#68](https://github.com/NullVoxPopuli/ember-vitest/pull/68) Group the setup contexts under their own nav heading ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))
  * [#67](https://github.com/NullVoxPopuli/ember-vitest/pull/67) Move the expect.soft tip to Getting started ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))
  * [#66](https://github.com/NullVoxPopuli/ember-vitest/pull/66) Fix setupContext owner and list every testing style in the nav ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))
  * [#64](https://github.com/NullVoxPopuli/ember-vitest/pull/64) Warn that render is not compatible with @ember/test-helpers ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))
  * [#63](https://github.com/NullVoxPopuli/ember-vitest/pull/63) Use the Ember brand colors in the docs theme ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))
  * [#62](https://github.com/NullVoxPopuli/ember-vitest/pull/62) Group the docs into core APIs and additional testing styles ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))
  * [#61](https://github.com/NullVoxPopuli/ember-vitest/pull/61) Move the docs to a VitePress site on GitHub Pages ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))
  * [#58](https://github.com/NullVoxPopuli/ember-vitest/pull/58) Show vanilla vitest examples first in the README ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))

#### Committers: 1
- @NullVoxPopuli's reduced-access machine account for AI usage ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))

## Release (2026-09-22)

* ember-vitest 0.7.0 (minor)

#### :rocket: Enhancement
* `ember-vitest`
  * [#57](https://github.com/NullVoxPopuli/ember-vitest/pull/57) Point @ember/test-helpers marks at the test line ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))
  * [#54](https://github.com/NullVoxPopuli/ember-vitest/pull/54) Record @ember/test-helpers helpers in the trace view and run their hooks ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))

#### :house: Internal
* `ember-vitest`
  * [#56](https://github.com/NullVoxPopuli/ember-vitest/pull/56) Test setupRenderingContext with the @ember/test-helpers helpers ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))

#### Committers: 1
- @NullVoxPopuli's reduced-access machine account for AI usage ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))

## Release (2026-09-16)

* ember-vitest 0.6.0 (minor)

#### :rocket: Enhancement
* `ember-vitest`
  * [#53](https://github.com/NullVoxPopuli/ember-vitest/pull/53) Click through userEvent so clicks appear in the trace view ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))

#### :house: Internal
* `ember-vitest`
  * [#52](https://github.com/NullVoxPopuli/ember-vitest/pull/52) Update @embroider/vite to fix a dep optimizer race ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))
  * [#50](https://github.com/NullVoxPopuli/ember-vitest/pull/50) Publish the test report to GitHub Pages ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))

#### Committers: 1
- @NullVoxPopuli's reduced-access machine account for AI usage ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))

## Release (2026-09-15)

* ember-vitest 0.5.0 (minor)

#### :rocket: Enhancement
* `ember-vitest`
  * [#48](https://github.com/NullVoxPopuli/ember-vitest/pull/48) Tear down leaked contexts after each test ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))
  * [#47](https://github.com/NullVoxPopuli/ember-vitest/pull/47) Record a trace mark on render ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))
  * [#46](https://github.com/NullVoxPopuli/ember-vitest/pull/46) Add locator selectors to the rendering context ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))
  * [#45](https://github.com/NullVoxPopuli/ember-vitest/pull/45) Use builder-pattern fixtures for the extended tests ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))
  * [#44](https://github.com/NullVoxPopuli/ember-vitest/pull/44) Upgrade to vitest 5 ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))

#### Committers: 1
- @NullVoxPopuli's reduced-access machine account for AI usage ([@NullVoxPopuli-ai-agent](https://github.com/NullVoxPopuli-ai-agent))

## Release (2026-04-28)

* ember-vitest 0.4.0 (minor)

#### :rocket: Enhancement
* `ember-vitest`
  * [#34](https://github.com/NullVoxPopuli/ember-vitest/pull/34) Make app parameter optional in setupRenderingContext ([@evoactivity](https://github.com/evoactivity))

#### :bug: Bug Fix
* `ember-vitest`
  * [#36](https://github.com/NullVoxPopuli/ember-vitest/pull/36) Accept ComponentLike in setupRenderingContext().render ([@evoactivity](https://github.com/evoactivity))

#### :house: Internal
* `ember-vitest`
  * [#37](https://github.com/NullVoxPopuli/ember-vitest/pull/37) pnpm dlx create-release-plan-setup@latest --update ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 2
- Liam ([@evoactivity](https://github.com/evoactivity))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2025-12-10)

* ember-vitest 0.3.3 (patch)

#### :bug: Bug Fix
* `ember-vitest`
  * [#24](https://github.com/NullVoxPopuli/ember-vitest/pull/24) Remove ignoreScripts setting from pnpm workspace ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2025-12-10)

* ember-vitest 0.3.2 (patch)

#### :memo: Documentation
* `ember-vitest`
  * [#23](https://github.com/NullVoxPopuli/ember-vitest/pull/23) Fix formatting in README for clarity ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2025-12-10)

* ember-vitest 0.3.1 (patch)

#### :bug: Bug Fix
* `ember-vitest`
  * [#14](https://github.com/NullVoxPopuli/ember-vitest/pull/14) Add 'src' to package.json files list ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2025-12-04)

* ember-vitest 0.3.0 (minor)

#### :rocket: Enhancement
* `ember-vitest`
  * [#11](https://github.com/NullVoxPopuli/ember-vitest/pull/11) Convert to typescript ([@SergeAstapov](https://github.com/SergeAstapov))

#### Committers: 1
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))

## Release (2025-11-13)

* ember-vitest 0.2.1 (patch)

#### :bug: Bug Fix
* `ember-vitest`
  * [#9](https://github.com/NullVoxPopuli/ember-vitest/pull/9) Add @ember/test-helpers to peerDependencies ([@SergeAstapov](https://github.com/SergeAstapov))

#### Committers: 1
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))

## Release (2025-11-13)

* ember-vitest 0.2.0 (minor)

#### :rocket: Enhancement
* `ember-vitest`
  * [#7](https://github.com/NullVoxPopuli/ember-vitest/pull/7) Upgrade vitest to v4 ([@SergeAstapov](https://github.com/SergeAstapov))

#### Committers: 1
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))

## Release (2025-10-02)

* ember-vitest 0.1.1 (patch)

#### :memo: Documentation
* `ember-vitest`
  * [#5](https://github.com/NullVoxPopuli/ember-vitest/pull/5) Update context setup to `await using`? ([@johanrd](https://github.com/johanrd))

#### Committers: 1
- [@johanrd](https://github.com/johanrd)

## Release (2025-09-30)

* ember-vitest 0.1.0 (minor)

#### :rocket: Enhancement
* `ember-vitest`
  * [#4](https://github.com/NullVoxPopuli/ember-vitest/pull/4) This looks kinda nice ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :house: Internal
* `ember-vitest`
  * [#1](https://github.com/NullVoxPopuli/ember-vitest/pull/1) Release plan ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)
