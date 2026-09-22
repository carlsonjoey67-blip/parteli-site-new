import test from 'node:test';
import assert from 'node:assert/strict';
import { sceneState, conversationFrame } from '../app/story-motion.ts';

for (const reduced of [false, true]) {
  test(`vehicle stays visible before departure (reduced=${reduced})`, () => {
    for (const progress of [0, 1700, 3100]) {
      const state = sceneState(progress, reduced, false);
      assert.equal(state.vehicleOpacity, 1);
      assert.equal(state.workflow, 0);
      assert.equal(state.depart, 0);
    }
  });
  test(`progressive transition never has an empty stage (reduced=${reduced})`, () => {
    for (let n = 0; n <= 100; n++) {
      const state = sceneState(n * 103, reduced, false);
      assert.ok(state.vehicleOpacity > 0 || state.workflow > 0);
      if (reduced) assert.equal(state.depart, 0);
    }
    assert.equal(sceneState(6000, reduced, false).workflow, 1);
    assert.equal(sceneState(6000, reduced, false).vehicleOpacity, 0);
  });
}
test('the conversation types before it sends and synchronizes', () => {
  assert.deepEqual(conversationFrame(0, 40), { step: 0, chars: 0 });
  const typing = conversationFrame(3400, 40);
  assert.equal(typing.step, 2);
  assert.ok(typing.chars > 0 && typing.chars < 40);
  assert.deepEqual(conversationFrame(5600, 40), { step: 3, chars: 40 });
});

// Time alone must carry a stationary viewport through every scene beat.
test('the complete vehicle story advances without any scroll input', () => {
  const entrance = sceneState(700, false, false);
  assert.equal(entrance.phase, 'entering');
  assert.ok(entrance.arrival > 0 && entrance.arrival < 1);
  assert.equal(sceneState(2400, false, false).phase, 'vehicle');
  const departure = sceneState(3800, false, false);
  assert.equal(departure.phase, 'departing');
  assert.ok(departure.depart < 0);
  const typing = sceneState(8000, false, false);
  assert.equal(typing.workflow, 1);
  assert.equal(conversationFrame(typing.conversationElapsed, 40).step, 2);
  const finished = sceneState(10300, false, false);
  assert.equal(finished.progress, 1);
  assert.equal(conversationFrame(finished.conversationElapsed, 40).step, 3);
});
