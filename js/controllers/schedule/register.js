bbb.controller('AttendenceRegister', function($scope, ParseService, $stateParams) { 

        $scope.bookings = []
        $scope.id=$stateParams.id

        $scope.iterations =[]

        dummyIteration = (new (Parse.Object.extend("Iteration")))
        dummyIteration.id = $scope.id                        


        new Parse.Query("Booking")
        .equalTo("iteration", dummyIteration)
        .include("user")
        .include("iteration").include("iteration.location")
        .find().then(function(result) {

                result.forEach(function(booking) {
                        booking.attended=false
                })
                
                $scope.bookings = result                
                
                $scope.$apply()
        })


        $scope.toggleAttendence = function(booking) {
                
                console.log(booking.get("iteration"))
                
		if (booking.attended) {
                        console.log("delete attendence record")
                } else {
                        
                        (new (Parse.Object.extend("Checkin")))
                        .save({
                                iteration: dummyIteration,
                                location: booking.get("iteration").get("location")
                        })
                        
                        
                        console.log("add attendence record")
                }       
        }


});
