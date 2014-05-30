bbb.controller('EventQRCode', function($scope, $state,  $stateParams,  $ionicModal, ParseService) { 

        console.log($stateParams.id)
        
        var Iteration = Parse.Object.extend("Iteration");
        var query = new Parse.Query(Iteration);
        query.include("event").include("event.series").include("host").include("location");
        query.get($stateParams.id, {})
        .then(function (results) {
                console.log("done")
                console.log(results);
                $scope.iteration=results
                $scope.$apply();                        
        })

        console.log(query)


})        