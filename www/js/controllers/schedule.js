bbb.controller('Schedule', function($scope, ParseService) { 
  var Event = Parse.Object.extend("events");
  var query = new Parse.Query(Event);
  query.find({
    success: function(results) {
      $scope.events=results;
      $scope.$apply();
    }
  });
});