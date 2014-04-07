bbb.controller('ListEvents', function($state, $scope, ParseService, $rootScope) { 
  
  $scope.moment=moment
  $scope.securityLevel=$rootScope.currentUser.get('securityLevel');
  
  var Event = Parse.Object.extend("Event");
  var query = new Parse.Query(Event);       
  
  if ($state.current.name!="tabs.schedule") {    
    var User = $rootScope.currentUser
    User.relation("bookings").query().find().then(function(result) {
      bookingId = []
      for (r in result) { bookingId.push(result[r].id) }
      console.log(bookingId)
      query.equalTo("objectId", bookingId)
    })    
  }
  
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