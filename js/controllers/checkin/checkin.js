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

                        .first().then(function(booking) {

                                console.log("booking search finished")

                                if (booking) {

                                        console.log("found booking")
                                        console.log(booking)
                                        console.log(booking.get("checkin"))

                                        if (booking.get("checkin")) {
                                                console.log("checkin already found")
                                        } else {
                                                console.log("started checkedin")
                                                {
                                                        checkin = new Parse.Object("Checkin")
                                                        checkin.save({
                                                                booking:booking,
                                                                user: Parse.User.current()
                                                        }).then(function (result) {
                                                                booking.set("checkin", result).save()
                                                                console.log("finished checkedin")

                                                        })          
                                                }
                                        }
                                })

                                $state.go("tabs.schedule")  

                        } );



                } catch (ex) {
                        console.log("error" + ex)
                }


        });