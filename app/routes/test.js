import Ember from 'ember';

export default Ember.Route.extend({

    tracker: Ember.inject.service(),

    model : function(){
        return this.store.query("station",{
            limitToLast :13
        });
    }
});
