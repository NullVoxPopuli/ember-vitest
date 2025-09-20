import { describe, it, expect } from 'vitest';
import { setupRenderingTest } from 'ember-vitest';
import { visit, pauseTest, render } from '@ember/test-helpers';

class Counter extends Component {
  @tracked count = 0;
  increment = () => this.count++;

  <template>
    <output>{{this.count}}</output>
    <button onclick={{this.increment}}></button>
  </template>
}

describe("Rendering | Counter", () => {
  setupRenderingTest();

    it('can interact', async () => {
        await render(
          <template>
            <Counter />
          </template>
        );

        // Uncomment to debug the app without pausing JS 
        // await pauseTest(); 



    });
});
