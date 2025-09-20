# ember-vitest

Ember<->Vitest integration

## Install

```
npm add --save-dev ember-vitest vitest  @vitest/browser webdriverio
```

## Usage

### Application Tests

```gjs
// tests/application/sample-test.gjs

import { describe, it, expect } from 'vitest';
import { setupApplicationTest } from 'ember-vitest';
import { visit, pauseTest } from '@ember/test-helpers';

describe("Application | Home", () => {
    it('can visit the home screen', async () => {
        await visit('/');

        // Uncomment to debug the app without pausing JS 
        // await pauseTest(); 

    });
});
```

### Rendering Tests

```gjs
import { describe, it, expect } from 'vitest';
import { setupRenderingTest } from 'ember-vitest';
import { visit, pauseTest } from '@ember/test-helpers';

class Conter 

describe("Rendering | Counter", () => {
    it('can interact', async () => {
        await visit('/');

        // Uncomment to debug the app without pausing JS 
        // await pauseTest(); 

    });
});
```

### Container Tests


## Setup

In order to use ember-vitest, you must have a vite config with plugins configured for compiling ember:
```js
import { defineConfig } from 'vite';

import { ember, extensions } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

export default defineConfig({
    plugins: [
        ember(),
        babel({
          babelHelpers: 'runtime',
          extensions,
        })
    ]
});
```

Your actual vite config may vary.
