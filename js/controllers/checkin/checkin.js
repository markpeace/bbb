bbb.controller('CheckIn', function($scope, $state, ParseService, EventModel, $ionicLoading) { 

        if(Parse.User.current().get("securityLevel")==1) { $scope.isAdmin=true }
        $scope.geolocated=false

        var locationBased = {

                getDistance: function(lat1, lon1, lat2, lon2) {
                        function deg2rad(deg) {
                                return deg * (Math.PI/180)
                        }
                        var R = 6371; // Radius of the earth in km
                        var dLat = deg2rad(lat2-lat1);  // deg2rad below
                        var dLon = deg2rad(lon2-lon1); 
                        var a = 
                            Math.sin(dLat/2) * Math.sin(dLat/2) +
                            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
                            Math.sin(dLon/2) * Math.sin(dLon/2)
                        ; 
                        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                        var d = R * c; // Distance in km
                        return d*1000;
                },                

                locate: function () {                        

                        locationBased.watch = navigator.geolocation.watchPosition(locationBased.getPlaces, function() {}, { maximumAge: 0, maxWait: 10000, enableHighAccuracy: true });
                        $scope.$on('$stateChangeStart', function() {
                                navigator.geolocation.clearWatch(locationBased.watch)
                        })   

                },
                getPlaces: function(e) {

                        $scope.geolocated=false

                        if(moment(e.timestamp).isAfter(moment().subtract("seconds", 5))) {

                                $scope.geolocated=e
                                $scope.geolocated.actTime=moment(e.timestamp)

                                $scope.nearby=EventModel.data().Location.filter(function(location) {
                                        if (location.explorationLocation && 
                                            locationBased.getDistance(e.coords.latitude, e.coords.longitude, location.geolocation.latitude, location.geolocation.longitude)<location.range) {                                
                                                return true
                                        }
                                })
                                $scope.$apply()

                        }
                }               


        }       

        locationBased.locate()


        $scope.scan = function() {

                try {

                        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

                        scanner.scan( function (result) { 

                                console.log("scanned")

                                dummyIteration = new Parse.Object("Iteration")
                                dummyIteration.id = result.text

                                new Parse.Query("Booking")
                                .equalTo("iteration", dummyIteration)
                                .equalTo("user", Parse.User.current())
                                .include("checkin")

                                .find().then(function(booking) {

                                        booking=booking[0]

                                        console.log("found booking")
                                        console.log(booking)

                                        if (booking.get("checkin")) {
                                                console.log("booking already found")
                                        } else {
                                                console.log("booking not found")
                                                checkin = new Parse.Object("Checkin")
                                                checkin.save({
                                                        booking:booking,
                                                        user: Parse.User.current()
                                                }).then(function (result) {
                                                        booking.set("checkin", result).save().then(function() {
                                                                $scope.$apply()
                                                        })

                                                })                        

                                        }
                                })

                                $state.go("tabs.schedule")  
                        })

                } catch (ex) {
                        console.log(ex)
                }
        }

        $scope.doCheckin = function(location) {

                $ionicLoading.show({ template: "Checking In..." })

                //MANUALLY SET THE FIRST ITERATION TO TAKE PLACE NOW, AND HERE
                //EventModel.data().Booking[0].iteration.time=moment().subtract("minutes",10)._d
                //EventModel.data().Booking[0].iteration.location.id=location.id               
                EventModel.data().Checkin=[]

                //SEE IF THERE IS AN EVENT CURRENTLY HAPPENING IN THIS PLACE                
                currentIteration = EventModel.data().Booking.filter(function(booking){
                        if(
                                booking.iteration.location.id==location.id
                                && moment().isAfter(moment(booking.iteration.time))
                                && moment().isBefore(moment(booking.iteration.time).add("minutes", booking.iteration.event.duration))
                        ) {          
                                return true
                        }      
                })[0] || null

                //CHECK THIS ISN'T A DUPLICATE
                
                //SAVE IT                
                EventModel.data().Checkin.push({ iteration: (currentIteration ? currentIteration.iteration : null), location: location })
                EventModel.save() 

                checkin = new (Parse.Object.extend("Checkin"))
                
                dummyIteration=null
                if (currentIteration) {
                        dummyIteration = new (Parse.Object.extend("Iteration"))
                        dummyIteration.id = currentIteration.iteration.id                         
                } 

                dummyLocation = new (Parse.Object.extend("Location"))
                dummyLocation.id = location.id;

                
                checkin.set("iteration", dummyIteration)
                checkin.set("location", dummyLocation)
                checkin.save().then(function() {
                        $ionicLoading.hide();
                        $state.go("tabs.explore")                                         
                });



                $ionicLoading.hide()
        }


});