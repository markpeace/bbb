bbb.controller('AttendenceRegister', function($scope, ParseService, $stateParams) { 

        $scope.attendees = ["M"]
        $scope.id=$stateParams.id
        
        $scope.iterations =[]


        dummyIteration = new Parse.Object("Iteration")
        dummyIteration.id = $stateParams.id

        new Parse.Query("Booking")
        .equalTo("iteration", dummyIteration)
        .include("user")
        .find().then(function(result) {
                $scope.attendees = result
                $scope.$apply()
        })
                

});
