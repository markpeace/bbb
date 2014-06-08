bbb.controller('CheckIn', function($scope, ParseService, cordovaCamera) { 

        console.log("checkin");
        try {

                var scanner = cordova.require("cordova/plugin/BarcodeScanner");

                scanner.scan( function (result) { 
                        
                        console.log("scanned")

                        new Parse.Query(Parse.Object.extend("Checkin"))
                        .get(result.text).then(function(iteration) {
                                console.log("processed")
                                console.log(iteration)
                        })

                } );



        } catch (ex) {
                console.log("error" + ex)
        }


});