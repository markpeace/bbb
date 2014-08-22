bbb.controller('ViewLocation', function($scope, $stateParams, ParseService, EventModel) { 
   
        $scope.location = {}
        
        angular.forEach(EventModel.data().locations, function (location) {
                if (location.id==$stateParams.id) { $scope.location=location }
        })

        if(Parse.User.current().get("securityLevel")==1) { $scope.isAdmin=true }
        
});