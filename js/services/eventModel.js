bbb.factory('EventModel', ["ParseService", "$rootScope", function(ParseService, $rootScope) {                      

        if(localStorage.getItem(Parse.User.current().id)) { 						// <- Needs removing when we go live...
                localStorage.setItem(Parse.User.current().id, JSON.stringify({
                        lastUpdated:moment().subtract('years',1)._d,
                        iterations: [],
                        dates:[]
                })) 
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
                        { table: "Series", constraints: [], fields: ["label"] },
                        { table: "Iteration", constraints: [".ascending('time')"], fields: ["capacity", "event", "location", "host", "time"] }
                        //{ table: "Booking", constraints: [".equalTo('User', "+Parse.User().current().id+")"], fields: ["iteration"] }
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
                                        cache.data[lookupItem.table][result.id].id=result.id
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


                iterations = []
                dates=[]

                for(var objectId in cache.data.Event	) {
                        cache.data.Event[objectId].series = cache.data.Series[cache.data.Event[objectId].series]
                }            

                for(var objectId in cache.data.Iteration	) {
                        cache.data.Iteration[objectId].event = cache.data.Event[cache.data.Iteration[objectId].event]
                        cache.data.Iteration[objectId].location = cache.data.Location[cache.data.Iteration[objectId].location]
                        cache.data.Iteration[objectId].host = cache.data.User[cache.data.Iteration[objectId].host]
                        iterations.push(cache.data.Iteration[objectId])

                        if (moment(cache.data.Iteration[objectId].time).format("dddd, Do MMMM")!=dates[dates.length-1]) {
                                dates.push(moment(cache.data.Iteration[objectId].time).format("dddd, Do MMMM"))
                        }
                }


                cache.data.iterations=iterations;
                cache.data.dates=dates

                cache.data.lastUpdated=moment()._d;                
                cache.save();

                $rootScope.$apply()

        }

        return {
                data: function() { return cache.data }
        }


}]);