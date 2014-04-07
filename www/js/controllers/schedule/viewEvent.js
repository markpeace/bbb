bbb.controller('ViewEvent', function($scope, ParseService, $rootScope, $stateParams) { 
  
  $scope.moment=moment
  $scope.attending={toggle:false};
  $scope.bookings=0
  
  var getEventDetails = function () {
    
    var Event = Parse.Object.extend("Event");
    var query = new Parse.Query(Event);
    query.include("series").include("host").include("location");
    query.get($stateParams.id, {})
    .then(function (results) {
      $scope.event=results
      
      $scope.booking={
        user: $rootScope.currentUser,
        event: results,
        attending: false
      }
      
    }).then (getUserBooking);
  }
  
  var getUserBooking = function () {
    $scope.event.relation("bookings").query().equalTo("user",$rootScope.currentUser).count().then(function(c) {
      if (c>0) { $scope.booking.attending=true; }     
    }).then(getCountofBookings);    
  }
  
  var getCountofBookings = function () {
    $scope.event.relation("bookings").query().count().then(function(c) {
      $scope.bookings=c      
      $scope.$apply();
    })
  }
  
  var setupWatchBookingToggle = function() {
    $scope.$watch('booking.attending', function (newVal, oldVal) {
      if (newVal!=oldVal) {
        
        (new Parse.Query(Parse.Object.extend("Booking"))).equalTo("user", $rootScope.currentUser).find().then(function (result) {
          for (r in result) { result[r].destroy() }
        }).then(getCountofBookings).then(function() {
          if (newVal==true) {
            var newBooking=new (Parse.Object.extend("Booking"))
            newBooking.save($scope.booking, {}).then(function(result) {
              $scope.event.relation("bookings").add(result)
              $scope.event.save()          
            }).then(getCountofBookings)
          }
        })
        
      }
    })
    
  }  
  
  getEventDetails();
  setupWatchBookingToggle();
  
  
});
