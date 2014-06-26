bbb.service('EventModel', [function(ParseService) {                      

        if(!localStorage.getItem(Parse.User.current().id)) { 
                localStorage.setItem(Parse.User.current().id, JSON.stringify({lastUpdated:moment().subtract('years',1)._d})) 
        	console.log("Created localStorage Item")
        }

        cache = {
                dc: this,
                data: JSON.parse(localStorage.getItem(Parse.User.current().id)),
                save: function () { localStorage.setItem(Parse.User.current().id, JSON.stringify(cache.data)) }
        }       
                        
        if(Parse.User.current().get('securityLevel')<2 || moment(new Date(cache.data.lastUpdated)) < moment().subtract('hours', 2) ) {                
                (new Parse.Query("Iteration"))
                .descending("updatedAt")
                .limit(1)
                .find().then(function(r) {        
                        if(new Date(cache.data.lastUpdated) < new Date(r[0].updatedAt)) { updateEvents() }
                })
        }

        var updateEvents = function() {
                console.log("updatedEvents")
                cache.data.lastUpdated=moment()._d;                
                cache.save();
        }

        var eventTemplate = function() {
                et=this;

                Object.defineProperty(et, "title", {
                        get: function(r) {
                                return this.title
                                console.log("get: " + this.title)
                        },
                        set: function(r) {
                                this.title=r
                                console.log("Set: " + this.title)
                        }
                })

        }


        }]);