bbb.controller('MessageAttendees', function($scope, $state, $stateParams, ParseService, $ionicLoading, $http, $q) { 

        $scope.data = { message: "" }

        $scope.id=$stateParams.id

        new Parse.Query("Iteration")
        .include("host").include("event")
        .get($scope.id).then(function(iteration) {
                $scope.iteration=iteration
        })

        $scope.sendMessage = function() {

                $ionicLoading.show({
                        template: 'Sending Message...'
                });

                dummyIteration = (new (Parse.Object.extend("Booking")))
                dummyIteration.id = $scope.id                        

                new Parse.Query("Booking")
                .equalTo("iteration", dummyIteration)
                .include("user")
                .find().then(function(bookings) {                        

                        secondPromises=[]

                        angular.forEach(bookings, function(booking) {
                                (new (Parse.Object.extend("Message")))
                                .save({
                                        from: Parse.User.current(),
                                        to: booking.get("user"),
                                        iteration: $scope.iteration,
                                        message: $scope.data.message
                                }).then(function(message) {

                                        secondPromises.push ($http({
                                                method: 'POST',
                                                //url: 'http://ordeal-dromic.codio.io:3000/pushnotify',
                                                url: 'http://mptoolbox.herokuapp.com/pushnotify',
                                                data: "data=" + JSON.stringify({
                                                        platform:booking.get("user").get("token").substring(0,1),
                                                        tokens:[booking.get("user").get("token").substring(1)],
                                                        applicationIndex: "1",
                                                        alert:"Message from "+ Parse.User.current().get("forename") + " " + Parse.User.current().get("surname") + " about the '" + $scope.iteration.get("event").get("title") + "' pop-up",
                                                        payload: { messageID: message.id }
                                                }),
                                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                        }))

                                })

                        })

                        $q.all(secondPromises).then(function() {
                                $ionicLoading.hide()
                                //$state.go("viewEvent", { id:$scope.id })
                        })

                })
        }


})        