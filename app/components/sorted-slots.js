import Ember from 'ember';

export default Ember.Component.extend({

    sortedSlots: Ember.computed.sort('slots', 'sortDefinition'),
    sortDefinition: ['start'],
});
