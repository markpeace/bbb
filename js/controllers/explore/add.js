bbb.controller('AddLocation', function($scope, $state, $stateParams, ParseService) { 

        $scope.location={
                geolocation: "Searching..."
        }

        if($stateParams.id) {
                console.log("NEED A MECHANISM TO RETRIEVE EXISTING ")
        } 

        $scope.saveLocation = function() {
                if($stateParams.id) {
                        console.log("NEED A MECHANISM TO SAVE EXISTING")
                } else {


                        (new (Parse.Object.extend("Location")))
                        .save($stateParams.location).then(function() {
                                $state.go("tabs.explore")
                        })                        
                }
        }


        geolocation = {
                g: this,                     
                attempts:0,
                maxAttempts:10,
                targetAccuracy:5,
                onSuccess:function(e) {
                        
                        $scope.location.geolocation = "Attempt #" + geolocation.attempts + " accuracy=" +e.coords.accuracy
                        $scope.$apply()
                        
                        if(e.coords.accuracy>geolocation.targetAccuracy) { geolocation.go(); }
                        
                },
                onError:function() {
                        geolocation.go();
                },
                go: function () {
                        geolocation.attempts++
                        if(geolocation.attempts>geolocation.maxAttempts) { return }                        
                        navigator.geolocation.getCurrentPosition(geolocation.onSuccess, geolocation.onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
                }
        }
        
        geolocation.go();



        /*
        var onSuccess = function(position) {
                alert('Latitude: '          + position.coords.latitude          + '\n' +
                      'Longitude: '         + position.coords.longitude         + '\n' +
                      'Altitude: '          + position.coords.altitude          + '\n' +
                      'Accuracy: '          + position.coords.accuracy          + '\n' +
                      'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                      'Heading: '           + position.coords.heading           + '\n' +
                      'Speed: '             + position.coords.speed             + '\n' +
                      'Timestamp: '         + position.timestamp                + '\n');
        };

        // onError Callback receives a PositionError object
        //
        function onError(error) {
                //alert('code: '    + error.code    + '\n' +
                 //     'message: ' + error.message + '\n');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
*/
});