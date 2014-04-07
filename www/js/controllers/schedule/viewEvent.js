bbb.controller('ViewEvent', function($scope, ParseService, $rootScope, $stateParams) { 
  
  $scope.moment=moment
  $scope.attending={toggle:false};
  
  var Event = Parse.Object.extend("Event");
  var query = new Parse.Query(Event);
  query.include("series").include("host").include("location");
  query.get($stateParams.id, {
    success: function(results) {
      $scope.event=results
      
      $scope.booking={
        user: $rootScope.currentUser,
        event: results,
        attending: false
      }
      
      var booking= Parse.Object.extend("Booking");
      var bookingQuery = new Parse.Query(booking);
      bookingQuery.equalTo("user", $scope.booking.user).equalTo("event", $scope.booking.event)
      
      bookingQuery.find({
        success:function(result) {
          if(result.length>0) {
            $scope.booking.attending=true
          }
        }
      }).then(function() {
        
        $scope.$watch('booking.attending', function(newVal,oldVal) {
          
          if(!newVal==oldVal) {
            
            var booking= Parse.Object.extend("Booking");
            var bookingQuery = new Parse.Query(booking);
            bookingQuery.equalTo("user", $scope.booking.user).equalTo("event", $scope.booking.event)
            
            bookingQuery.find({
              success:function(result) {
                for (r in result) { result[r].destroy() }
              }
            }).then(function() {
              if (newVal) {
                var booking = new (Parse.Object.extend("Booking")); 
                booking.save($scope.booking,{})       
              }
            })
            
          }
        })
        $scope.$apply()
      })
      
    }
  });
  
});