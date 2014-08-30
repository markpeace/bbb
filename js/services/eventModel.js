bbb.factory('EventModel', ["NotificationService","ParseService", "$ionicLoading","$rootScope","$state", function(NotificationService, ParseService, $ionicLoading, $rootScope, $state) {                      

        var _refresh = function () {

                console.log("refresh")

                if(!localStorage.getItem(Parse.User.current().id)) { 						// <- Needs removing when we go live...
                        localStorage.setItem(Parse.User.current().id, JSON.stringify({
                                lastUpdated: {Iteration: moment().subtract('years',1)._d},
                                iterations: [],
                                dates:[]
                        })) 
                        NotificationService.reminders.destroyAll();
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
                                if(moment(cache.data.lastUpdated.Iteration) < moment(r[0].updatedAt)) { 
                                        NotificationService.reminders.destroyAll();
                                        updateData(); 
                                }
                        })
                }



                var updateData = function () {                

                        $ionicLoading.show({
                                template: 'Updating...'
                        });

                        toLookUp = [
                                { table: "Setting", constraints: [], fields: ["settings"] },
                                { table: "User", constraints: [".lessThan('securityLevel', 3)"], fields: ["forename", "surname", "blurb"] },
                                { table: "Location", constraints: [], fields: ["label", "blurb", "categories", "clue", "enigmaticTitle", "explorationLocation", "popupLocation", "geolocation", "range" ] },
                                { table: "Event", constraints: [], fields: ["description", "series", "title", "duration", "cohorts"] },
                                { table: "Series", constraints: [], fields: ["label"] },
                                { table: "Iteration", constraints: [".ascending('time')"], fields: ["capacity", "event", "location", "host", "time"] },
                                { table: "Booking", constraints: [".equalTo('user', Parse.User.current())"], fields: ["iteration"] },
                                { table: "Checkin", constraints: [".equalTo('user', Parse.User.current())"], fields: ["iteration", "location"] }
                        ]
                        lookupIndex=-1

                        var checkTable = function () {

                                $ionicLoading.hide();

                                if (lookupIndex==toLookUp.length-1) { return weaveData();}

                                lookupIndex++
                                lookupItem = toLookUp[lookupIndex]

                                if(!cache.data[lookupItem.table]) { cache.data[lookupItem.table] = [] }

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
                                cache.data[lookupItem.table] = []

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
                                                newItem.id=result.id
                                                cache.data[lookupItem.table].push(newItem)
                                        })

                                        cache.data.lastUpdated[lookupItem.table] = moment()._d;
                                        console.log("updated " + lookupItem.table)

                                        checkTable()

                                })

                        }

                        checkTable()


                }



                var weaveData= function() {

                        try {


                                var findIt = function(table, id) {

                                        response={}

                                        angular.forEach(table, function (r) {
                                                if (r.id==id) { response=r }
                                        })
                                        return response
                                }

                                //UPDATE SETTINGS

                                cache.data.settings = {} 

                                angular.forEach(cache.data.Setting, function (s) {
                                        for (key in JSON.parse(s.settings)) {
                                                cache.data.settings[key] = JSON.parse(s.settings)[key]
                                        }
                                })

                                for(var objectId in cache.data.Setting) {
                                        cache.data.settings = JSON.parse(cache.data.Setting[objectId].settings)
                                }


                                //UPDATE EVENTS

                                angular.forEach(cache.data.Event, function(event) {
                                        event.series = findIt(cache.data.Series, event.series.id || event.series)
                                })

                                //UPDATE ITERATIONS
                                angular.forEach(cache.data.Iteration, function(iteration){
                                        iteration.event = findIt(cache.data.Event, iteration.event.id || iteration.event)
                                        iteration.location = findIt(cache.data.Location, iteration.location.id || iteration.location)
                                        iteration.host = findIt(cache.data.User, iteration.host.id || iteration.host)

                                        iteration.booked = iteration.host.id==Parse.User.current().id ? true : false
                                        iteration.isHost = iteration.host.id==Parse.User.current().id ? true : false


                                        iteration.inCohort = JSON.stringify(iteration.event.cohorts).indexOf(Parse.User.current().get("cohort").id)
                                        iteration.inCohort = iteration.inCohort==-1 ? false : true
                                        iteration.inCohort = iteration.event.cohorts.length==0 ? true : iteration.inCohort                                                                                                                   
                                })

                                lastDate=null
                                cache.data.IterationDate = []

                                cache.data.Iteration.forEach(function(iteration) {                                              

                                        newDate = moment(iteration.time).format("dddd, Do MMMM")                           

                                        if (cache.data.IterationDate.indexOf(newDate)) { cache.data.IterationDate.push(newDate) }

                                })                               

                                //UPDATE BOOKINGS

                                cache.data.Booking.forEach(function(booking) {                
                                        booking.iteration=findIt(cache.data.Iteration, booking.iteration.id || booking.iteration )
                                        booking.iteration.booked=true             
                                })                                                

                                //UPDATE LOCATIONS


                                cache.data.LocationCategory = []

                                cache.data.Location.forEach(function(location) {
                                        location.categories = location.categories || "" 
                                        location.categories.split(";").forEach(function(category){
                                                if(cache.data.LocationCategory.indexOf(category)==-1 && category!="") {cache.data.LocationCategory.push(category)}
                                        })
                                })

                                //UPDATE CHECKINS
                                cache.data.Checkin.forEach(function(checkin) {
                                        checkin.iteration=checkin.iteration ? findIt(cache.data.Iteration, checkin.iteration.id || checkin.iteration ) : null
                                        checkin.location=findIt(cache.data.Location, checkin.location.id || checkin.location )
                                })


                                cache.data.lastUpdated.Iteration=moment()._d;      
                                console.log(cache.data)
                                cache.save();

                                $ionicLoading.hide();

                                $rootScope.$apply()
                        } catch(ex) {
                                alert(ex)
                                alert("An unknown error has occurred, please try again later. \n\nIf the problem persists, please contact m.peace@mmu.ac.uk")
                                localStorage.removeItem(Parse.User.current().id)
                        }

                }

                }   

        return {
                refresh: function() { _refresh() },
                save: function() { cache.save() },
                data: function() { 
                        if (typeof cache === 'undefined') { _refresh() } 
                        return cache.data 
                },
                toggleBooking: function (iteration) {

                        angular.forEach(cache.data.Iteration, function(i, index) {
                                if (iteration.id==i.id) { iterationIndex=index }
                        })

                        if (iteration.host.id == Parse.User.current().id) {
                                if(iteration.isHost) {
                                        alert("You cannot unbook yourself from this event, because you are the host")
                                        iteration.booked=true
                                }
                                return;
                        }                                       

                        if (iteration.booked) {

                                clash = false;

                                cache.data.Booking.forEach(function(booking) {
                                        //console.log(booking)

                                        if ((moment(booking.iteration.time)<=moment(iteration.time)) && (moment(booking.iteration.time).add("minutes", booking.iteration.event.duration) > moment(iteration.time))) {
                                                clash=true
                                        }


                                        //DOES THIS ONE START BEFORE THE NEXT, AND FINISH AFTER IT?                                                
                                        if ((moment(iteration.time)<moment(booking.iteration.time)) && (moment(iteration.time).add("minutes", iteration.event.duration) > moment(booking.iteration.time))) {
                                                clash=true
                                        }

                                })

                                if (clash) {
                                        alert("You are already booked onto an event at this time.")
                                        iteration.booked=false;
                                        return;
                                }                                

                                $ionicLoading.show({
                                        template: 'Completing Booking...'
                                });

                                cache.data.Booking.push({iteration:iteration});

                                dummyIteration = (new (Parse.Object.extend("Booking")))
                                dummyIteration.id = iteration.id;        

                                (new (Parse.Object.extend("Booking")))	
                                .save({user:Parse.User.current(), iteration:dummyIteration}).then(function() {
                                        $ionicLoading.hide();
                                }) 
                                iteration.bookings++;
                                cache.save();        

                                NotificationService.reminders.set(iteration)

                        } else if(!iteration.booked) {                       
                                $ionicLoading.show({
                                        template: 'Removing Booking...'
                                });

                                cache.data.Booking = cache.data.Booking.filter(function(booking){
                                        return booking.iteration.id!=iteration.id
                                })

                                NotificationService.reminders.destroy(iteration);                              
                                (new Parse.Query("Booking"))
                                .equalTo("user", Parse.User.current())
                                .equalTo("iteration", dummyIteration)
                                .find().then(function(r){
                                        angular.forEach(r,function(r) {
                                                r.destroy(); 
                                                iteration.bookings--;
                                                $rootScope.$apply();
                                        })
                                        $ionicLoading.hide()
                                })

                                cache.save();                
                        }                        

                }
        }


}]);