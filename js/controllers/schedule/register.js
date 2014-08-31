bbb.controller('AttendenceRegister', function($scope, ParseService, $stateParams, $q) { 

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

                $scope.bookings = result                   

                result.forEach(function(booking) {
                        new Parse.Query("Checkin")
                        .equalTo("iteration", dummyIteration)
                        .equalTo("user", booking.get('user'))                        
                        .limit(1).find().then(function(result) {                                
                                booking.checkin=result[0] || null   
                                $scope.$apply();
                        })
                })

        })


        $scope.toggleAttendence = function(booking) {

                if (booking.checkin) {
                        booking.checkin.destroy().then(function(){
                                booking.checkin=null;
                                $scope.$apply()
                        })
                } else {

                        (new (Parse.Object.extend("Checkin")))
                        .save({
                                iteration: dummyIteration,
                                location: booking.get("iteration").get("location"),
                                user: booking.get('user')
                        }).then(function(checkin) {
                                booking.checkin=checkin
                                $scope.$apply()
                        }) 

                }       
        }


});
