bbb.controller('ViewEvent', function($scope, ParseService, EventModel, $ionicModal, $ionicLoading, $stateParams, $state) {                    
        
        $scope.moment=moment;

        $scope.currentUser=Parse.User.current()
        $scope.securityLevel=Parse.User.current().get('securityLevel')
        $scope.emailVerified=Parse.User.current().get('emailVerified')

        $scope.allowBookings=EventModel.data().settings.allowBookings
        
        angular.forEach(EventModel.data().iterations, function(iteration) {
                if (iteration.id==$stateParams.id) { $scope.iteration=iteration }
        })

        dummyIteration = (new (Parse.Object.extend("Booking"))).set("objectId", $scope.iteration.id)

        var getCountOfBookings = function() {
                (new Parse.Query("Booking"))
                .equalTo("iteration", dummyIteration)
                .count().then(function(r) {
                        $scope.iteration.bookings=r
                        
                        if ($scope.iteration.capacity-r == 0 ) { findAlternativeIterations()}
                        
                        $scope.$apply()
                })
        }
        getCountOfBookings ();
        
        var findAlternativeIterations = function() {
                $scope.alternativeIterations = []
                
                angular.forEach(EventModel.data().iterations, function (i) {
                        if (i.event.id == $scope.iteration.event.id && i.id!=$scope.iteration.id) { $scope.alternativeIterations.push(i) }
                })
                
                $scope.$apply();
        }
        
        


        $scope.$watch("iteration.booked", function(n,o) {
		if (n!=o) { EventModel.toggleBooking($scope.iteration); }
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
