bbb.controller('MessageAttendees', function($scope, $state, $stateParams, ParseService, $http) { 

        $scope.data = {
                tokens:[]
        }

        $scope.id=$stateParams.id

        dummyIteration = (new (Parse.Object.extend("Booking")))
        dummyIteration.id = $scope.id                        


        new Parse.Query("Booking")
        .equalTo("iteration", dummyIteration)
        .include("user")
        .find().then(function(result) {

                angular.forEach(result, function(r) {
                        if (r.get("user").get("token")) {$scope.data.tokens.push(r.get("user").get("token"))}
                })      

                $scope.data.applicationIndex="1"
                $scope.data.alert = "You have received a message from Mark Peace (host of 'Stupid Questions Amnesty' pop-up)"
                $scope.data.payload = { test: "mark peace" }
                
                $http({
                        method: 'POST',
                        url: 'http://mptoolbox.herokuapp.com/pushnotify',
                        data: "data=" + JSON.stringify($scope.data),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                .success(function() {
                        console.log("done")
                })
                .error(function(data, status, headers, config) {
                        console.log(data)
                });


        })


})        