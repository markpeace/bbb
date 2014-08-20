bbb.controller('ListLocations', function($scope, ParseService) { 
        if(Parse.User.current().get("securityLevel")==1) { $scope.isAdmin=true }
});