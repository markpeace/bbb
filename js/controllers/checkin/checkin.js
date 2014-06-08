bbb.controller('CheckIn', function($scope, ParseService, cordovaCamera) { 

        console.log("checkin");
        try {

                var scanner = cordova.require("cordova/plugin/BarcodeScanner");

                scanner.scan( function (result) { 

                        
                        new (Parse.Query(Parse.Object.extend("Checkin")))
                        .get(result.text, {}).then(function(result) {
                                console.log(result)
                        })

                } );



        } catch (ex) {
                console.log("error" + ex)
        }


});