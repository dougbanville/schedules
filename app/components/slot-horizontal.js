import Ember from 'ember';

const stationSlotsComponent = Ember.Component.extend({
	tagName : '',
	classNames: ['slot-container'],
	count: Ember.computed('slots',function(){
		let model = this.get('slots');
		return model.get('firstObject');
	})
});

stationSlotsComponent.reopenClass({
	positionalParams: ['slots','index','total']

});

export default stationSlotsComponent;