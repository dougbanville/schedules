import DS from 'ember-data';

export default DS.Model.extend({

    name : DS.attr('string'),
	slug : DS.attr('string'),
	slot: DS.hasMany('slot', { async: true, inverse: null }),

});
