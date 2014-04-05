bbb.controller('ListEvents', function($scope, ParseService, $rootScope) { 
  
  $scope.securityLevel=$rootScope.currentUser.get('securityLevel');
  
  var Event = Parse.Object.extend("Events");
  var query = new Parse.Query(Event);
  query.ascending("time");
  query.find({
    success: function(results) {
      
      function formatDate(d) {
        dt= new Date(d);
        return dt.getDate().toString() + "-" + dt.getMonth().toString() + "-"  + dt.getFullYear().toString()
      }
      
      $scope.events=results;
      $scope.dates=[];
      t=""
      for (r in results) {
        if (formatDate(results[r].get("time"))!=t) { $scope.dates.push(results[r].get("time")) }
        t=formatDate(results[r].get("time"))
      }
      
      $scope.selectedDate=0;
      $scope.$apply();
    }
  });
  
  $scope.changeDate=function(increment) {
    $scope.selectedDate=$scope.selectedDate+increment;
  }
  
});