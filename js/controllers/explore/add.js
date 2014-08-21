bbb.controller('AddLocation', function($scope, $state, $stateParams, $ionicLoading, ParseService) { 

        $scope.location={
                geolocation: {accuracy: 99999}
        }

        if($stateParams.id) {
                console.log("NEED A MECHANISM TO RETRIEVE EXISTING ")
        } 

        $scope.saveLocation = function() {
                if($stateParams.id) {
                        console.log("NEED A MECHANISM TO SAVE EXISTING")
                } else {

                        navigator.geolocation.clearWatch(geolocation.watch)
                        $ionicLoading.show({template:"Saving..."});

                        (new (Parse.Object.extend("Location")))
                        .save($scope.location).then(function() {
                                $ionicLoading.hide();
                                $state.go("tabs.explore")                                         
                        })                        
                }
        }

        $scope.goBack=function() {
                navigator.geolocation.clearWatch(geolocation.watch)    
                $state.go("tabs.explore") 
        }


        geolocation = {
                g: this,
                active: false,
                attempts:0,
                targetAccuracy:11,
                onSuccess:function(e) {

                        geolocation.attempts++

                        if(e.coords.accuracy<$scope.location.geolocation.accuracy) {  
                                $scope.location.geolocation = e.coords
                                $scope.$apply()
                        }

                        if(e.coords.accuracy<geolocation.targetAccuracy) {                                 
                                navigator.geolocation.clearWatch(geolocation.watch) 
                                geolocation.active=false;
                                $scope.location.geolocation=e.coords
                                $scope.$apply();
                        }

                },
                onError:function() {},
                go: function () {
                        console.log("looking for location")
                        geolocation.watch = navigator.geolocation.watchPosition(geolocation.onSuccess, geolocation.onError, { maximumAge: 3000, maxWait: 10000, enableHighAccuracy: true });
                        geolocation.active=true;
                }
        }       

        if($scope.location.geolocation.accuracy>1000) { geolocation.go(); }  
        $scope.refreshLocation = function() {
                geolocation.go(); 
        }

});