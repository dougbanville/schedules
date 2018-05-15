import Ember from 'ember';

export default Ember.Controller.extend({

    timeStripeContainerSize : Ember.computed("model",function(){

		let model = this.get('model').get('firstObject');
		//let firstItem = model.get('firstObject');
		let firstItem = model.get('slot').get('firstObject');//length;

		let size = firstItem.get('slotHeight') + firstItem.get('timeSinceMidnight');


		let height = firstItem.length;
		return `12800px`;

	})
});
