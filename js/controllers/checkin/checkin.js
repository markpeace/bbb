bbb.controller('CheckIn', function($scope, ParseService, cordovaCamera) { 

        console.log("checkin");
        try {

                console.log('scanning');

                var scanner = cordova.require("cordova/plugin/BarcodeScanner");

                scanner.scan( function (result) { 

                        console.log(result.text)

                }, function (error) { 
                        console.log("Scanning failed: ", error); 
                } );



        } catch (ex) {
                console.log("error" + ex)
        }


});