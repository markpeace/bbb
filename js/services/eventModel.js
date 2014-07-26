bbb.factory('EventModel', ["ParseService", "$ionicLoading","$rootScope","$state", function(ParseService, $ionicLoading, $rootScope, $state) {                      

        if(!localStorage.getItem(Parse.User.current().id)) { 						// <- Needs removing when we go live...
                localStorage.setItem(Parse.User.current().id, JSON.stringify({
                        lastUpdated: {Iteration: moment().subtract('years',1)._d},
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

        if(Parse.User.current().get('securityLevel')<2 
           || moment(new Date(cache.data.lastUpdated.Iteration)) < moment().subtract('hours', 2) 
           || !(cache.data.User && cache.data.Location && cache.data.Event && cache.data.Series && cache.data.Iteration && cache.data.Booking)) {  
                (new Parse.Query("Iteration"))
                .descending("updatedAt")
                .limit(1)
                .find().then(function(r) {        
                        if(new Date(cache.data.lastUpdated.Iteration) < new Date(r[0].updatedAt)) { updateData(); }
                })
        }


        var updateData = function () {                

                $ionicLoading.show({
                        template: 'Updating...'
                });

                toLookUp = [
                        { table: "User", constraints: [".lessThan('securityLevel', 3)"], fields: ["forename", "surname", "blurb"] },
                        { table: "Location", constraints: [], fields: ["label", "blurb"] },
                        { table: "Event", constraints: [], fields: ["description", "series", "title", "length", "cohorts"] },
                        { table: "Series", constraints: [], fields: ["label"] },
                        { table: "Iteration", constraints: [".ascending('time')"], fields: ["capacity", "event", "location", "host", "time"] },
                        { table: "Booking", constraints: [".equalTo('user', Parse.User.current())"], fields: ["iteration"] },
                        { table: "Checkin", constraints: [".equalTo('user', Parse.User.current())"], fields: ["booking"] }
                ]
                lookupIndex=-1

                var checkTable = function () {

                        $ionicLoading.hide();

                        if (lookupIndex==toLookUp.length-1) { return weaveData();}

                        lookupIndex++
                        lookupItem = toLookUp[lookupIndex]


                        $ionicLoading.show({
                                template: 'Updating ' + lookupItem.table
                        });                        

                        query = new Parse.Query(lookupItem.table)
                        angular.forEach(lookupItem.constraints, function (constraint) { eval("query" + constraint) })                        
                        query.descending("updatedAt").limit(1).find().then(function(r) {
                                if (r.length==0 || new Date(cache.data.lastUpdated[lookupItem.table]) > new Date(r[0].updatedAt)) { 
                                        return checkTable(); 
                                } else {
                                        refreshData(lookupItem)
                                }

                        })



                }

                var refreshData = function(lookupItem) {
                        cache.data[lookupItem.table] = {}

                        query = new Parse.Query(lookupItem.table)
                        angular.forEach(lookupItem.constraints, function (constraint) { eval("query" + constraint) })
                        query.find().then(function(results) {
                                angular.forEach(results, function(result) {
                                        newItem = {}
                                        angular.forEach(lookupItem.fields, function (field) {                                                
                                                newItem[field] = result.get(field)    
                                                if (newItem[field]) {                                                        
                                                        if (newItem[field].id) { newItem[field]=newItem[field].id }
                                                }
                                        })
                                        cache.data[lookupItem.table][result.id]=newItem
                                        cache.data[lookupItem.table][result.id].id=result.id
                                })

                                cache.data.lastUpdated[lookupItem.table] = moment()._d;

                                console.log("updated " + lookupItem.table)

                                checkTable()

                        })

                }

                checkTable()


        }



        var weaveData= function() {


                iterations = []
                dates=[]

                for(var objectId in cache.data.Event) {
                        if (cache.data.Event[objectId].series.id) {
                                cache.data.Event[objectId].series = cache.data.Series[cache.data.Event[objectId].series.id]
                        } else {
                                cache.data.Event[objectId].series = cache.data.Series[cache.data.Event[objectId].series]
                        }

                }            

                for(var objectId in cache.data.Booking) {
                        cache.data.Iteration[cache.data.Booking[objectId].iteration].booked = true
                        cache.data.Booking[objectId].iteration = cache.data.Iteration[cache.data.Booking[objectId].iteration]
                }            

                for(var objectId in cache.data.Iteration) {

                        cache.data.Iteration[objectId].event = cache.data.Event[cache.data.Iteration[objectId].event]
                        cache.data.Iteration[objectId].location = cache.data.Location[cache.data.Iteration[objectId].location]
                        cache.data.Iteration[objectId].host = cache.data.User[cache.data.Iteration[objectId].host]

                        if (cache.data.Iteration[objectId].host.id==Parse.User.current().id) {
                                cache.data.Iteration[objectId].booked=true;
                                cache.data.Iteration[objectId].isHost=true;
                        }

                        
                        push_it=true
                        if (cache.data.Iteration[objectId].event.cohorts.length && JSON.stringify(cache.data.Iteration[objectId].event.cohorts).indexOf(Parse.User.current().get("cohort").id)==-1) {
                        	push_it=false
                        }
                        
                        if (push_it==true || Parse.User.current().get('securityLevel')<2 || cache.data.Iteration[objectId].host.id==Parse.User.current().id ) {
                                iterations.push(cache.data.Iteration[objectId])

                                if (moment(cache.data.Iteration[objectId].time).format("dddd, Do MMMM")!=dates[dates.length-1]) {
                                        dates.push(moment(cache.data.Iteration[objectId].time).format("dddd, Do MMMM"))
                                }

                        }
                }

                for(var objectId in cache.data.Checkin) {
                        cache.data.Checkin[objectId].booking = cache.data.Booking[cache.data.Checkin[objectId].booking]
                }

                cache.data.iterations=iterations;
                cache.data.dates=dates

                cache.data.lastUpdated.Iteration=moment()._d;      
                console.log(cache.data)
                cache.save();

                $ionicLoading.hide();

                $rootScope.$apply()

        }

        return {
                data: function() { return cache.data },
                toggleBooking: function (iteration) {

                        angular.forEach(cache.data.iterations, function(i, index) {
                                if (iteration.id==i.id) { iterationIndex=index }
                        })

                        if (iteration.host.id == Parse.User.current().id) {
                                if(iteration.booked!=true) {
                                        alert("You cannot unbook yourself from this event, because you are the host")
                                        iteration.booked=true
                                }
                                return;
                        }

                        dummyIteration = (new (Parse.Object.extend("Booking")))
                        dummyIteration.id = iteration.id                        

                        if (iteration.booked) {

                                clash = false;

                                angular.forEach(cache.data.iterations, function(i){

                                        if(i.id!=iteration.id && i.booked) {

                                                //DOES THE PREVIOUS START BEFORE THIS, AND FINISH AFTER IT?

                                                if ((moment(i.time)<moment(iteration.time)) && (moment(i.time).add("minutes", i.event.length) > moment(iteration.time))) {
                                                        clash=true
                                                }


                                                //DOES THIS ONE START BEFORE THE NEXT, AND FINISH AFTER IT?                                                
                                                if ((moment(iteration.time)<moment(i.time)) && (moment(iteration.time).add("minutes", iteration.event.length) > moment(i.time))) {
                                                        clash=true
                                                }

                                        }

                                })                                

                                if (clash) {
                                        alert("You are already booked onto an event at this time.")
                                        iteration.booked=false;
                                        return;
                                }                                

                                cache.data.iterations[iterationIndex].booked=true;
                                (new (Parse.Object.extend("Booking")))	
                                .save({user:Parse.User.current(), iteration:dummyIteration})   
                                iteration.bookings++;
                                cache.save();        

                        } else if(!iteration.booked) {                        
                                cache.data.iterations[iterationIndex].booked=false;                                
                                (new Parse.Query("Booking"))
                                .equalTo("user", Parse.User.current())
                                .equalTo("iteration", dummyIteration)
                                .find().then(function(r){
                                        angular.forEach(r,function(r) {
                                                r.destroy(); 
                                                iteration.bookings--;
                                                $rootScope.$apply();
                                        })
                                })

                                cache.save();                
                        }                        

                }
        }


}]);