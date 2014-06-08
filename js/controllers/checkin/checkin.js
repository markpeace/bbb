bbb.controller('CheckIn', function($scope, ParseService, cordovaCamera) { 

        console.log("checkin");
        try {


                navigator.camera.getPicture( function( imageURI ) {
                        alert( imageURI );
                },
                                            function( message ) {
                                                    alert( message );
                                            },
                                            {
                                                    quality: 50,
                                                    destinationType: Camera.DestinationType.FILE_URI
                                            });

        } catch (ex) {
                console.log("error" + ex)
        }


});