bbb.controller('ViewEvent', function($scope, ParseService, $rootScope, $ionicModal, $stateParams) { 

        console.log(navigator.connection.type)
        console.log("thats it")
        
        alert("yep")

        document.addEventListener("offline", onOffline, false);

        function onOffline() {
               console.log("gone offline")
               alert("nope")
        }

        $scope.moment=moment
        $scope.attending={toggle:false};
        $scope.bookings=0

        $scope.emailVerified=Parse.User.current().get('emailVerified')
        $scope.securityLevel=Parse.User.current().get('securityLevel')

        $scope.currentUser=Parse.User.current()


        $ionicModal.fromTemplateUrl('pages/schedule/viewEvent_locationinfo.html', function($ionicModal) {
                $scope.locationinfoModal = $ionicModal;
        }, {
                scope: $scope,
                animation: 'slide-in-up'
        });


        $ionicModal.fromTemplateUrl('pages/schedule/viewEvent_personInfo.html', function($ionicModal) {
                $scope.personinfoModal = $ionicModal;
        }, {
                scope: $scope,
                animation: 'slide-in-up'
        });



        var getEventDetails = function () {

                var Iteration = Parse.Object.extend("Iteration");
                var query = new Parse.Query(Iteration);
                query.include("event").include("event.series").include("host").include("location");
                query.get($stateParams.id, {})
                .then(function (results) {
                        $scope.iteration=results
                        $scope.booking = { attending: false }
                }).then (getUserBooking);
        }

        var getUserBooking = function () {               
                new Parse.Query(Parse.Object.extend("Booking"))
                .equalTo("user", Parse.User.current()).equalTo("iteration", $scope.iteration)
                .count(function(c) {
                        if (c>0) { $scope.booking.attending=true; }   
                        $scope.$apply();
                }).then(getCountofBookings);    
        }

        var getCountofBookings = function () {
                new Parse.Query(Parse.Object.extend("Booking"))
                .equalTo("iteration", $scope.iteration).count().then(function(c) {
                        $scope.bookings=c      
                        $scope.$apply();
                }).then(setupWatchBookingToggle)
        }

        var setupWatchBookingToggle = function() {
                $scope.$watch('booking.attending', function (newVal, oldVal) {
                        if (newVal!=oldVal) {


                                if(newVal==true) {

                                        $scope.bookings=$scope.bookings+1

                                        var Booking = Parse.Object.extend("Booking");
                                        booking = new Booking(); 
                                        booking.set("user", Parse.User.current());
                                        booking.set("iteration", $scope.iteration);
                                        saved_booking=booking.save().then(function(saved_booking) {
                                                $scope.iteration.relation("bookings").add(saved_booking)
                                                $scope.iteration.save()       

                                                Parse.User.current().fetch().then(function(user) {
                                                        user.relation("bookings").add(saved_booking)
                                                        user.save()                                                  
                                                })                                                                                    
                                        })


                                } else {
                                        $scope.bookings=$scope.bookings-1
                                        new Parse.Query(Parse.Object.extend("Booking"))
                                        .equalTo("user", Parse.User.current()).equalTo("iteration", $scope.iteration)
                                        .find(function(results) {
                                                angular.forEach(results, function(b) {                                                 
                                                        b.destroy(); 
                                                })
                                        })

                                }

                        }
                })

        }  

        getEventDetails();        


        $scope.sendEmailConfirmation = function () {
                Parse.User.current().set("email", Parse.User.current().get("email"))
                Parse.User.current().save()
                alert("A confirmation email has been resent")
        }

});
