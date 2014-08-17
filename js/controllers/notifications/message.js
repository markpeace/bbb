bbb.controller('ReadMessage', function($scope, $stateParams, $ionicLoading) { 

        $ionicLoading.show({
                template: 'Loading Message...'
        });

        $scope.moment = moment
        
        $scope.message={}
        new Parse.Query("Message")
        .include("from")
        .include("iteration").include("iteration.event")
        .get($stateParams.id).then(function(result) {
                $scope.message=result
                $ionicLoading.hide()
        })

})        