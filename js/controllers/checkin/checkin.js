bbb.controller('CheckIn', function($scope, $state, ParseService, cordovaCamera) { 

        try {

                var scanner = cordova.require("cordova/plugin/BarcodeScanner");

                scanner.scan( function (result) { 

                        console.log("scanned")

                        dummyIteration = new Parse.Object("Iteration")
                        dummyIteration.id = result.text

                        new Parse.Query("Booking")
                        .equalTo("iteration", dummyIteration)
                        .equalTo("user", Parse.User.current())

                        .find().then(function(booking) {

                                booking=booking[0]

                                console.log("found booking")
                                console.log(booking)
                                console.log(booking.get("checkin"))

                                if (booking.get("checkin")) {
                                        console.log("booking already found")
                                } else {
                                        console.log("booking not found")
                                }
                        })

                        $state.go("tabs.schedule")  

                } );



        } catch (ex) {
                console.log("error" + ex)
        }


});