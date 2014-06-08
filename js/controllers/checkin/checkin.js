bbb.controller('CheckIn', function($scope, ParseService, cordovaCamera) { 

        console.log("checkin");
        try {

                var scanner = cordova.require("cordova/plugin/BarcodeScanner");

                scanner.scan( function (result) { 

                        console.log("scanned")

                        new Parse.Query(Parse.Object.extend("Iteration"))
                        .get(result.text).then(function(iteration) {
                                
                                new (Parse.Object.extend("Checkin"))
                                .save({
                                        user: Parse.User.current(),
                                        iteration: iteration                                       
                                })
                                
                        })

                } );



        } catch (ex) {
                console.log("error" + ex)
        }


});