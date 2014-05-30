bbb.controller('CheckIn', function($scope, ParseService) { 

        try {
                console.log("checkin");


                navigator.camera.getPicture();

                navigator.plugins.barcodeScanner.scan(
                        function (result) {
                                alert("We got a barcode\n" +
                                      "Result: " + result.text + "\n" +
                                      "Format: " + result.format + "\n" +
                                      "Cancelled: " + result.cancelled);
                        }, 
                        function (error) {
                                alert("Scanning failed: " + error);
                        }
                );

        } catch (ex) {
                console.log(ex.message)
        }

});