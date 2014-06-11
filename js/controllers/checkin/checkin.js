bbb.controller('CheckIn', function($scope, $state, ParseService, cordovaCamera) { 


        $scope.scan = function() {

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
        }()

});