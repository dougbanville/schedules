import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('slot-horizontal', 'Integration | Component | slot horizontal', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{slot-horizontal}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#slot-horizontal}}
      template block text
    {{/slot-horizontal}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
