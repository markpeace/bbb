bbb.controller('ListEvents', function($state, $scope, ParseService, $rootScope) { 
  
  $scope.moment=moment
  $scope.securityLevel=$rootScope.currentUser.get('securityLevel');
  
  var Event = Parse.Object.extend("Event");
  var query = new Parse.Query(Event);
    
  console.log($state.current.name)
  
  query.ascending("time").include("series").include("host");
  query.find({
    success: function(results) {
      
      $scope.events=results;
      $scope.dates=[];
      t=""
      for (r in results) {
        proposed=moment(results[r].get("time")).format("dddd, Do MMMM")
        if (proposed!=t) { $scope.dates.push(proposed) }
        t=proposed
      }
      
      $scope.selectedDate=0;
      
      $scope.$apply();
    }
  });
  
  $scope.changeDate=function(increment) {
    $scope.selectedDate=$scope.selectedDate+increment;
  }
  
});