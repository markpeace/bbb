bbb.controller('MessageAttendees', function($scope, $state, $stateParams, ParseService, $ionicLoading, $http) { 

        $scope.data = {
                tokens:[],
                payload: { message: "" }
        }

        $scope.id=$stateParams.id

        new Parse.Query("Iteration")
        .include("host").include("event")
        .get($scope.id).then(function(iteration) {
                $scope.iteration=iteration
        })

        $scope.sendMessage = function() {
                dummyIteration = (new (Parse.Object.extend("Booking")))
                dummyIteration.id = $scope.id                        

                new Parse.Query("Booking")
                .equalTo("iteration", dummyIteration)
                .include("user")
                .find().then(function(result) {

                        $ionicLoading.show({
                                template: 'Sending Message...'
                        });

                        angular.forEach(result, function(r) {
                                if (r.get("user").get("token")) {$scope.data.tokens.push(r.get("user").get("token"))}
                        })      

                        $scope.data.applicationIndex="1"
                        $scope.data.alert = "You have received a message from "+
                                Parse.User.current().get("forename") + " " +
                                Parse.User.current().get("surname") +
                                " about of the '" + 
                                $scope.iteration.get("event").get("title") + "' pop-up"

                        $http({
                                method: 'POST',
                                url: 'http://mptoolbox.herokuapp.com/pushnotify',
                                data: "data=" + JSON.stringify($scope.data),
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        })
                        .success(function() {
                                $ionicLoading.hide();
                                console.log("done")
                        })
                        .error(function(data, status, headers, config) {
                                $ionicLoading.hide();
                                alert("An error prevented your message from being sent:" + data)
                        });


                })
        }


})        