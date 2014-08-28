bbb.controller('ListLocations', function($scope, ParseService, EventModel) { 
        
        if(Parse.User.current().get("securityLevel")==1) { $scope.isAdmin=true }
        
        $scope.locations=EventModel.data().Location
        $scope.locationCategories=EventModel.data().LocationCategory
        
        $scope.filter={
                explorationLocation: true
        }
        
});