bbb.controller('ListEvents', function($state, $scope, ParseService, $rootScope) { 

        $scope.moment=moment
        $scope.securityLevel=$rootScope.currentUser.get('securityLevel')

        $scope.changeDate=function(increment) {
                $scope.selectedDate=$scope.selectedDate+increment;
        }

        var getAllEvents = function () {
                var Iteration = Parse.Object.extend("Iteration")
                var query = new Parse.Query(Iteration);
                query.ascending("time").include("event").include("host").include("event.series")
                .find().then(function (results) {
                        $scope.iterations=results
                        findDates();
                })       

        }

        var getBookedEvents = function () {
                $scope.events=[]
                var User=$rootScope.currentUser
                User.relation("bookings").query().include("event").include("event.host").include("event.series").find().then(function(result) {
                        eventIds=[]
                        for (r in result) { $scope.events.push(result[r].get("event")) }
                        findDates();
                })
        }

        var findDates = function () {
                $scope.dates=[];

                t=""
                angular.forEach($scope.iterations, function (event) {
                        proposed=moment(event.get("time")).format("dddd, Do MMMM")
                        if (proposed!=t) { $scope.dates.push(proposed) }
                        t=proposed
                })
                
                $scope.selectedDate=0
                $scope.$apply()
        }
        

        if ($state.current.name=="tabs.schedule") { 
                $scope.scheduleTabColour='rgba(247, 200, 0, 0.5)'
                getAllEvents()
        } else if($state.current.name=="tabs.schedule_booked") {
                $scope.bookedTabColour='rgba(247, 200, 0, 0.5)'
                getBookedEvents()
        }



});