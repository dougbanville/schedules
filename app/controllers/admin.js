import Ember from 'ember';

export default Ember.Controller.extend({

    actions: {
        saveOrder(s){
            let order = s.get("order");
            s.set("order",order);
            s.save();
            alert("test" + order)
        }
    }
});
