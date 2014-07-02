bbb.controller('ListEvents', function($state, $scope, ParseService, $rootScope, EventModel) { 



        $scope.moment=moment
        $scope.securityLevel=$rootScope.currentUser.get('securityLevel')

        $scope.data=EventModel.data();       
        $scope.selectedDate=0;

        console.log($scope.data)

        $scope.filterByDate = function(items) {

                r=[]


                angular.forEach(items, function(item) {
                        if(moment(item.time).format("dddd, Do MMMM")==$scope.data.dates[$scope.selectedDate]) { r.push(item) }
                })

                return r;
        }

        $scope.changeDate=function(increment) {
                $scope.selectedDate=$scope.selectedDate+increment;
        }


        if ($state.current.name=="tabs.schedule") { 
                $scope.scheduleTabColour='rgba(247, 200, 0, 0.5)'
                //getAllEvents()
        } else if($state.current.name=="tabs.schedule_booked") {
                $scope.bookedTabColour='rgba(247, 200, 0, 0.5)'
                //getBookedEvents()
        }



});