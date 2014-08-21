bbb.controller('ListLocations', function($scope, ParseService, EventModel) { 
        
        if(Parse.User.current().get("securityLevel")==1) { $scope.isAdmin=true }
        
        $scope.locations=EventModel.data().locations
        $scope.locationCategories=EventModel.data().locationCategories
        
        $scope.filter={
                explorationLocation: true
        }
        
});