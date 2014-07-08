bbb.controller('ViewEvent', function($scope, ParseService, EventModel, $ionicModal, $ionicLoading, $stateParams, $state) {                    

        $scope.moment=moment;

        $scope.currentUser=Parse.User.current()
        $scope.securityLevel=Parse.User.current().get('securityLevel')
        $scope.emailVerified=Parse.User.current().get('emailVerified')

        angular.forEach(EventModel.data().iterations, function(iteration) {
                if (iteration.id==$stateParams.id) { $scope.iteration=iteration }
        })

        dummyIteration = (new (Parse.Object.extend("Booking"))).set("objectId", $scope.iteration.id)

        var getCountOfBookings = function() {
                (new Parse.Query("Booking"))
                .equalTo("iteration", dummyIteration)
                .count().then(function(r) {
                        //console.log(r)
                })
        }
        getCountOfBookings();


        $scope.$watch("iteration.booked", function(n,o) {

                if ($scope.iteration.host.id == Parse.User.current().id) {
                        if(n!=true) {
                                alert("You cannot unbook yourself from this event, because you are the host")
                                $scope.iteration.booked=true
                                return
                        }
                        return;
                }


                if (n && n!=o) {
                        (new (Parse.Object.extend("Booking")))	
                        .save({user:Parse.User.current(), iteration:dummyIteration})   
                        EventModel.save();                
                } else if(!n && n!=o) {                        

                        (new Parse.Query("Booking"))
                        .equalTo("user", Parse.User.current())
                        .equalTo("iteration", dummyIteration)
                        .find().then(function(r){
                                angular.forEach(r,function(r) {r.destroy()})
                        })
                        EventModel.save();                
                }

        })

        $ionicModal.fromTemplateUrl('pages/schedule/viewEvent_locationinfo.html', function($ionicModal) {
                $scope.locationinfoModal = $ionicModal;
        }, {
                scope: $scope,
                animation: 'slide-in-up'
        });


        $ionicModal.fromTemplateUrl('pages/schedule/viewEvent_personInfo.html', function($ionicModal) {
                $scope.personinfoModal = $ionicModal;
        }, {
                scope: $scope,
                animation: 'slide-in-up'
        });

        $scope.sendEmailConfirmation = function () {
                Parse.User.current().set("email", Parse.User.current().get("email"))
                Parse.User.current().save()
                alert("A confirmation email has been resent")
        }

});
