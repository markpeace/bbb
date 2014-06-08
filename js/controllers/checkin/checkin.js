bbb.controller('CheckIn', function($scope, ParseService, cordovaCamera) { 

        console.log("checkin");
        try {

                var scanner = cordova.require("cordova/plugin/BarcodeScanner");

                scanner.scan( function (result) { 

                        console.log("scanned")

                        new Parse.Query(Parse.Object.extend("Iteration"))
                        .get(result.text).then(function(iteration) {

                                var Checkin = Parse.Object.extend("Checkin");
                                checkin = new Checkin(); 

                                checkin.save({
                                        user: Parse.User.current(),
                                        iteration: iteration                                       
                                })

                                console.log("saver")
                        })

                } );



        } catch (ex) {
                console.log("error" + ex)
        }


});