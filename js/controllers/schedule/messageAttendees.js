bbb.controller('MessageAttendees', function($scope, $state, $stateParams, ParseService) { 
        $scope.id=$stateParams.id

        dummyIteration = (new (Parse.Object.extend("Booking")))
        dummyIteration.id = $scope.id                        


        new Parse.Query("Booking")
        .equalTo("iteration", dummyIteration)
        .include("user")
        .find().then(function(result) {
                
                tokens=[]
                
       		angular.forEach(result, function(r) {
                        tokens.push(r.get("user").get("token"))
                })      
                
                console.log(tokens)
        })

})        