import { module, test } from 'qunit';
import { setupTest } from 'zoule-youhi/tests/helpers';

module('Unit | Route | amazon/aws', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:amazon/aws');
    assert.ok(route);
  });
});
