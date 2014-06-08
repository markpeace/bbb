bbb.controller('CheckIn', function($scope, ParseService, cordovaCamera) { 

        console.log("checkin");
        try {

                console.log('scanning');

                var scanner = cordova.require("cordova/plugin/BarcodeScanner");

                scanner.scan( function (result) { 

                        alert("We got a barcode\n" + 
                              "Result: " + result.text + "\n" + 
                              "Format: " + result.format + "\n" + 
                              "Cancelled: " + result.cancelled);  

                        console.log("Scanner result: \n" +
                                    "text: " + result.text + "\n" +
                                    "format: " + result.format + "\n" +
                                    "cancelled: " + result.cancelled + "\n");
                        document.getElementById("info").innerHTML = result.text;
                        console.log(result);
                        /*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */

                }, function (error) { 
                        console.log("Scanning failed: ", error); 
                } );



        } catch (ex) {
                console.log("error" + ex)
        }


});