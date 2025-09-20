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
