import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { describe, it, expect } from 'vitest';
import { renderingTest } from 'ember-vitest';
import { find, click, render, pauseTest } from '@ember/test-helpers';

class Counter extends Component {
  @tracked count = 0;
  increment = () => this.count++;

  <template>
    <output>{{this.count}}</output>
    <button onclick={{this.increment}}>++</button>
  </template>
}

describe("Counter", () => {
    renderingTest('can interact', async () => {
        await render(
          <template>
            <Counter />
          </template>
        );
    
        expect(find('output').textContent).toBe('0');

        await click('button');

        expect(find('output').textContent).toBe('1');
    });
});
