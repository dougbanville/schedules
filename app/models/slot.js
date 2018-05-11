import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({

    image : DS.attr('string'),
	automated : DS.attr('boolean'),
	studio : DS.attr('string'),
	prog_description : DS.attr('string'),
	genre : DS.attr('string'),
	end : DS.attr('date'),
	title : DS.attr('string'),
	programme_pia_id : DS.attr('number'),
    start : DS.attr('date'),
    station : DS.belongsTo("station", { async: true, inverse: null }),
	startDate : Ember.computed('start', function(){
		let start = this.get('start');
		return moment(start).utc();
    }),
    type : DS.attr('string'),
	today : DS.attr('date'),
    station_name : DS.attr('string'),
    tracker : Ember.inject.service(),
    slotId : Ember.computed('station','end', function(){
		let station = this.get('station_name');
		let id = this.get('id');
		let elementId = station + id;
		let html = `${elementId}`;
		return new  Ember.String.htmlSafe(html);
		return html;
    }),
    slotSize : Ember.computed('start','end', function(){
		let startHours =  moment(this.get('start'));
		let endHours =  moment(this.get('end'));
		let duration = endHours.diff(startHours);
		duration = moment.duration(duration).asHours();
		duration = duration * 200;
		if(startHours < 1){ //it's midnight
			return 0;
		}else{
			//return Math.round(duration);
			return duration;
			//return new Ember.Handlebars.SafeString(Math.round(duration));
		}
    }),
    slotWidth : Ember.computed('slotSize','currentPosition', 'tracker', function(){
		let size = this.get('slotSize');
		let html = `width:${size}px;`;
		return new  Ember.String.htmlSafe(html);
    }),
    slotHeight : Ember.computed('slotSize','onair', 'currentPosition', 'slotId', function(){
		let size = this.get('slotSize');
		let isLive = this.get('onair');
		let id = this.get('slotId');
		let marginTop = 0;	
		if(size > 400){
			let padding = size / 4;
			padding = `${padding}.px`;
			marginTop = padding;
		}
		let tsPosition = this.get('tracker').TimeStripePosition;
		
		let html = `height:${size}px; padding-top:${marginTop};  border-bottom: 1px solid white; overflow:hidden;`;
		return new  Ember.String.htmlSafe(html);
	}),
	timeSinceMidnight : Ember.computed('start','slotSize', 'station', function(){
		let start = moment(this.get('start'));
		let midnight = moment().startOf('day');
		let stationClass = this.get('station');
		let timesincemidnight = moment(start).diff(moment().startOf('day'));
		timesincemidnight = moment.duration(timesincemidnight).asHours();
		timesincemidnight = timesincemidnight * 200;

		let size = this.get('slotSize') + timesincemidnight;
		let html = `width:${size}px;`;
		return new  Ember.String.htmlSafe(html);

	}),
	timeSinceMidnightVertical : Ember.computed('start','slotSize', 'station', function(){
		let start = moment(this.get('start'));
		let midnight = moment().startOf('day');
		let stationClass = this.get('station');
		let timesincemidnight = moment(start).diff(moment().startOf('day'));
		timesincemidnight = moment.duration(timesincemidnight).asHours();
		timesincemidnight = timesincemidnight * 200;

		let size = this.get('slotSize') + timesincemidnight;
		let html = `height:${size}px;  border-bottom: 1px solid white;`;
		return new  Ember.String.htmlSafe(html);

	}),
	timeToMidnight : Ember.computed('start','end', function(){
		let start = moment(this.get('start'));
		let midnight = moment().endOf('day');
		let time = moment(start).diff(moment().startOf('day'));
		time = moment.duration(time).asHours();
		return `${time} to midnight`;
		//time = time * 200;
	}),
	titleFormatted : Ember.computed('title','slotSize', function(){
		if(this.get('slotSize') < 100){
			return '<h1 class="verticalText">'+ this.get('title') +'</h1>';
		}else{
			return '<h1>'+ this.get('title') +'</h1>';
		};
	}),
	timesFormatted : Ember.computed('start','end','slotSize', function(){
		let start =  moment(this.get('start')).format("LT");
		let end =  moment(this.get('end')).format("LT");
		if(this.get('slotSize') > 100){
			return `<p class="startend">${start} - ${end}</p>`;
		}else{
			return null
		};
	}),
	imageFormatted : Ember.computed('slotSize', 'image', function(){
		let image = this.get('image');
		if(this.get('slotSize') > 140){
			return `<div class="image_container"><img src="${image}" class="slot_image"></div>`;
		}else{
			return null;
		}
	}),
	studioButton : Ember.computed('studio', 'slotSize', function(){
		let studio = this.get('studio');
		let slotSize = this.get('slotSize');
		if(studio != "" && slotSize > 100){
			return `<span class="white studiobutton"><i class="fa fa-microphone"></i> ${studio}</span>`;
		}
	}),
	timeRemaining : Ember.computed('start','end',function(){
		let start = moment(this.get('start'));
		return start.fromNow();
		}),
	stationClass : Ember.computed('station_name', 'onair', 'slotSize', function(){
		let stationClass = this.get('station_name');
		//stationClass = stationClass.replace(2,"two");
		let html = `${stationClass}`;
		return new  Ember.String.htmlSafe(html);
	}),
	sizeClass : Ember.computed('station_name', 'onair', 'slotSize', function(){
		let liveClass = "";
		let sizeClass = "slot-regular";
		let station_name = this.get('station_name');
		if(this.get('slotSize')>120){
			sizeClass = "slot-large";
		}
		if(this.get('slotSize')>300){
			sizeClass = "slot-extra-large";
		}
		if(this.get('slotSize')>650){
			sizeClass = "slot-extra-extra-large";
		}
		if(this.get('onair')){
			liveClass = `${station_name}_live`;
		}
		//let stationClass = this.get('station_name');
		//stationClass = stationClass.replace(2,"two");
		//return stationClass;
		let html = `slot ${sizeClass} ${liveClass}`;
		//return new  Ember.String.htmlSafe(html);
	}),
	livePosition : Ember.computed('onair','tracker', 'slotSize', function(){

		return this.get('tracker').TimeStripePosition;

	}),
	verticalTopMargin : Ember.computed('slotSize','currentPosition', function(){
		let slotSize = this.get('slotSize');
		let marginTop = slotSize / 2;
		let html = `${marginTop}`;
		return new  Ember.String.htmlSafe(html);
		return html;

	}),
	currrentTime : Ember.computed('tracker',function(){
		return this.get('tracker').currentTime;
		//return moment().format();
	})
});
