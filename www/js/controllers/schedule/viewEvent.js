bbb.controller('ViewEvent', function($scope, ParseService, $rootScope, $stateParams) { 
  
  $scope.moment=moment
  
  var Event = Parse.Object.extend("Event");
  var query = new Parse.Query(Event);
  query.include("series").include("host").include("location");
  query.get($stateParams.id, {
    success: function(results) {
      $scope.event=results      
      $scope.$apply()
    }
  });
  
});