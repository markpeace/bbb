bbb.controller('EventQRCode', function($scope, $state,  $stateParams,  $ionicModal, ParseService, $window) { 

        $scope.width= $window.innerWidth<$window.innerHeight ? $window.innerWidth : $window.innerHeight * .9
        $scope.width = $scope.width *.9
        
        var Iteration = Parse.Object.extend("Iteration");
        var query = new Parse.Query(Iteration);
        query.include("event").include("event.series").include("host").include("location");
        query.get($stateParams.id, {})
        .then(function (results) {
                $scope.iteration=results
                $scope.$apply();                        
        })

})        