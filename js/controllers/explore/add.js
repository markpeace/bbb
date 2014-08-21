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
                targetAccuracy:11,
                onSuccess:function(e) {
                        
                        geolocation.attempts++
                        
                        $scope.location.geolocation = e.coords
                        $scope.$apply()
                                                
                        if(e.coords.accuracy<geolocation.targetAccuracy) {                                 
                                navigator.geolocation.clearWatch(geolocation.watch) 
                                $scope.location.geolocation=e.coords
                                $scope.$apply();
                        }
                        
                },
                onError:function() {},
                go: function () {
                        geolocation.watch = navigator.geolocation.watchPosition(geolocation.onSuccess, geolocation.onError, { maximumAge: 3000, maxWait: 10000, enableHighAccuracy: true });
                }
        }
        
        geolocation.go();

});