bbb.controller('AttendenceRegister', function($scope, ParseService, $stateParams) { 

        $scope.bookings = []
        $scope.id=$stateParams.id

        $scope.iterations =[]


        dummyIteration = (new (Parse.Object.extend("Booking")))
        dummyIteration.id = $scope.id                        


        new Parse.Query("Booking")
        .equalTo("iteration", dummyIteration)
        .include("user")
        .include("checkin")
        .find().then(function(result) {

                $scope.bookings = result
                $scope.$apply()
        })


        $scope.toggleAttendence = function(booking) {

                if(booking.get("checkin")) {
                        booking.get("checkin").destroy().then(function() {
                                booking.set("checkin", null).save().then(function() {
                                        $scope.$apply()
                                })
                        })
                } else {
                        checkin = new Parse.Object("Checkin")
                        checkin.save({
                                booking:booking,
                                user: Parse.User.current()
                        }).then(function (result) {
                                booking.set("checkin", result).save().then(function() {
                                        $scope.$apply()
                                })

                        })                        

                }
        }


});
