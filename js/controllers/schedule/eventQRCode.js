bbb.controller('EventQRCode', function($scope, $state,  $stateParams,  $ionicModal, ParseService, $window, EventModel) { 

        $scope.width= $window.innerWidth<$window.innerHeight ? $window.innerWidth : $window.innerHeight * .9
        $scope.width = $scope.width *.9
        
        $scope.iteration = EventModel.data().Iteration.filter(function(iteration) {         
                return iteration.id==$stateParams.id
        })[0] || null

})        