bbb.controller('CheckIn', function($scope, ParseService, cordovaCamera) { 

        console.log("checkin");
        try {


                $scope.takePicture = function() {
                        cordovaCamera.getPicture({

                                // See all the possible Camera options from the Camera docs:
                                // https://github.com/apache/cordova-plugin-camera/blob/master/doc/index.md#cameraoptions

                        }).then(function(imageData) {

                                // Success! Image data is here

                        }, function(err) {

                                // An error occured. Show a message to the user

                        });
                }
                
                $scope.takePicture()

        } catch (ex) {
                console.log("error" + ex)
        }


});