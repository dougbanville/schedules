import Ember from 'ember';
import moment from 'moment';

export default Ember.Service.extend({

	timeStripeActive : true,
	currentTime : moment().format(),
	store: Ember.inject.service(),
	//currentTime : moment().format(),

	whatsOnAir(station){
		return this.get("store").queryRecord("on-air",{
				station : station
			})
	},

	onAir(){
		let live = this.whatsOnAir("radio1");
		var title = "";
		var it = live.then(result =>{
			//console.log("service" + result.get("title"));
			//return title;
			title = result.get("title");
		});

		this.set("onAirTitle",this.title);
	},

	setTimeStripeStatus(status){
		this.set("timeStripeActive",status);
	},
	setTimeStripePosition(position){
		let html = `${position}`;
		this.set("TimeStripePosition",new  Ember.String.htmlSafe(html));
	},
	setMenuKeyLocation(menuPosition){
		let html = `left:${menuPosition}px;`;
		this.set("menuLocation",new  Ember.String.htmlSafe(html));
	},
	setCurrentTime(time){
		this.set("currentTime", time);
		console.log(`the time is ${time}`)
	},
	setStationPosition(stationPosition){
		this.set("stationPosition", stationPosition)
		console.log(`station position ${stationPosition}`)
	}
});
