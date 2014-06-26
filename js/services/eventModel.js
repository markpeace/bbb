bbb.service('EventModel', [function(ParseService) {                      

        if(localStorage.getItem(Parse.User.current().id)) { 						// <- Needs removing when we go live...
                localStorage.setItem(Parse.User.current().id, JSON.stringify({lastUpdated:moment().subtract('years',1)._d})) 
                console.log("Created localStorage Item")
        }

        cache = {
                dc: this,
                data: JSON.parse(localStorage.getItem(Parse.User.current().id)),
                save: function () { localStorage.setItem(Parse.User.current().id, JSON.stringify(cache.data)); console.log("Saved Local Data Cache") }
        }       

        if(Parse.User.current().get('securityLevel')<2 || moment(new Date(cache.data.lastUpdated)) < moment().subtract('hours', 2) ) {                
                (new Parse.Query("Iteration"))
                .descending("updatedAt")
                .limit(1)
                .find().then(function(r) {        
                        if(new Date(cache.data.lastUpdated) < new Date(r[0].updatedAt)) { updateData(); }
                })
        }


        var updateData = function () {

                toLookUp = [
                        { table: "User", constraints: [".lessThan('securityLevel', 3)"], fields: ["forename", "surname", "blurb"] },
                        { table: "Location", constraints: [], fields: ["label", "blurb"] },
                        { table: "Event", constraints: [], fields: ["description", "series", "title"] },
                        { table: "Iteration", constraints: [], fields: ["capacity", "event", "location"] },
                        //{ table: "Booking", constraints: [".equalTo('User', "+Parse.User().current.id+")"], fields: ["iteration"] }
                ]

                lookupIndex=0

                var performLookup = function () {
                        
                        lookupItem = toLookUp[lookupIndex]

                        cache.data[lookupItem.table] = []

                        query = new Parse.Query(lookupItem.table)
                        angular.forEach(lookupItem.constraints, function (constraint) { eval("query" + constraint) })
                        query.find().then(function(results) {
                                angular.forEach(results, function(result) {
                                        newItem = {}
                                        angular.forEach(lookupItem.fields, function (field) {
                                                newItem[field] = result.get(field)      
                                                if (newItem[field].id) { newItem[field]=newItem[field].id }
                                        })
                                        cache.data[lookupItem.table][result.id]=newItem
                                })
                                
                                console.log("updated " + lookupItem.table)
                                
                                lookupIndex++
                                if (lookupIndex<toLookUp.length) { 
                                	performLookup()
                                } else {
                                        weaveData();
                                }
                                
                        })

                }

                performLookup()


        }



        var weaveData= function() {

                           console.log(cache.data)
                           
                console.log("updatedEvents")
                cache.data.lastUpdated=moment()._d;                
                cache.save();
        }


        }]);