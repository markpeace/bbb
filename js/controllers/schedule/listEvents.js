bbb.controller('ListEvents', function($state, $scope, ParseService, $rootScope) { 

        $scope.moment=moment
        $scope.securityLevel=$rootScope.currentUser.get('securityLevel')
        $scope.iterations=[]
        
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
                
                $rootScope.currentUser.relation("bookings").query().include("iteration").include("iteration.event")
                .include("iteration.host").include("iteration.event.series").find().then(function (result) {
                        console.log(result)
                        angular.forEach (result, function (r) { $scope.iterations.push(r.get("iteration")) })
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