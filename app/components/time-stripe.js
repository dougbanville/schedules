import Ember from 'ember';

const timeStripeConponent = Ember.Component.extend({

	tracker: Ember.inject.service(),

	tsClass: Ember.computed(function() {
		let direction = this.get('direction');
		let html = `timeStripe-${direction}`;
		return new Ember.String.htmlSafe(html);
	}),

	makeTimeStripe() {
		console.log("Page Load ");
	},

	init() {
		this._super(...arguments);
		this._poll(1000);
		//this.makeTimeStripe();
	},

	myPoller() {
		// do something on an interval 
		var hourSize = this.get('hourSize');
		var now = new Date();
		var hour = now.getHours();
		var minute = now.getMinutes();
		var second = now.getSeconds();
		//console.log(hour + " " + minute + " " + second);
		var tsHeight = (hour * hourSize) +
			((minute / 60) * hourSize) +
			((second / 3600) * hourSize);
		var direction = this.get('direction');
		Ember.$("#timeStripe").css(direction, tsHeight);
		console.log(`ts height = ${tsHeight}`);
		if (this.get('tracker').timeStripeActive) {
			
			if (direction == "width") {
				window.scrollTo(tsHeight - 800, 0);
				console.log("active" + tsHeight)
			} else {
				window.scrollTo(0, tsHeight - 300);
			}
			this.get('tracker').setTimeStripePosition(tsHeight);
			let menuPosition = tsHeight - 800;
			this.get('tracker').setMenuKeyLocation(menuPosition);
			let largePosition = tsHeight - 200;
			largePosition = largePosition + "px";

			//Ember.$(".liveLarge > .innerDiv > .slot > .slot_inner").css("padding-left","100px");
		}

		//reload the page in wee small hours
		let format = 'hh:mm:ss'
		let time = moment(now, format),
			beforeTime = moment('04:21:10', format),
			afterTime = moment('04:21:11', format);

		if (time.isBetween(beforeTime, afterTime)) {

			//console.log('is between')
			window.location.reload(true);

		} else {

		}
		//use dom selectors to check positions??
		//console.log(Ember.$(".rnag > .live").position());
	},

	_poll(interval) {

		this.myPoller();

		Ember.run.later(() => this._poll(interval), interval);
	},



	mouseDown: function() {
		//Ember.$("#timeStripe").hide();
		this.get('tracker').setTimeStripeStatus(false);
		let position = this.get('tracker').TimeStripePosition
			//let cssParams = `{ left : ${ position}, position:'absolute'}`
			//Ember.$(".ReactivateButton").css({left: 3247, position:'absolute'});
	},

	actions: {
		reActivateTS() {
			this.get('tracker').setTimeStripeStatus(true);
		}
	}

});

timeStripeConponent.reopenClass({
	positionalParams: ['direction', 'hourSize']
});

export default timeStripeConponent;