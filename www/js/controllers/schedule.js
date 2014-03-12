bbb.controller('Schedule', function($scope, ParseService) { 
  var Event = Parse.Object.extend("events");
  var query = new Parse.Query(Event);
  query.ascending("Date");
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
        if (formatDate(results[r].get("Date"))!=t) { $scope.dates.push(results[r].get("Date")) }
        t=formatDate(results[r].get("Date"))
      }
      
      $scope.selectedDate=0;
      $scope.$apply();
    }
  });
  
  $scope.changeDate=function(increment) {
    $scope.selectedDate=$scope.selectedDate+increment;
  }
  
});