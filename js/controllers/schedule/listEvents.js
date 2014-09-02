bbb.controller('ListEvents', function($state, $scope, ParseService, $rootScope, EventModel, NotificationService) { 

        $scope.moment=moment
        $scope.securityLevel=$rootScope.currentUser.get('securityLevel')

        $scope.data=EventModel.data();       
        $scope.selectedDate=0;

        $scope.selectTab= function(tab) {
                $scope.selectedTab=tab	

                if ($scope.selectedTab=="ALL") { 
                        $scope.scheduleTabColour='rgba(247, 200, 0, 0.5)'
                        $scope.bookedTabColour='rgba(255, 255, 255, 0.5)'
                } else if($scope.selectedTab=="BOOKED") {
                        $scope.bookedTabColour='rgba(247, 200, 0, 0.5)'
                        $scope.scheduleTabColour='rgba(255, 255, 255, 0.5)'
                }

        }
        $scope.selectTab("ALL")

        $scope.filter = function(items) {

                if (!$scope.data.IterationDate) { return; }

                return items.filter(function(item, index) {   
                        
                        if (!item.inCohort && $scope.securityLevel!=1 ) { return false }
                        
                        if(moment(item.time).format("dddd, Do MMMM")==$scope.data.IterationDate[$scope.selectedDate]) { 
                                if($scope.selectedTab=="BOOKED") {
                                        if(item.booked) { return true }
                                } else {
                                        return true
                                }
                        }
                })
        }

        $scope.changeDate=function(increment) {
                $scope.selectedDate=$scope.selectedDate+increment;
        }


        if ($scope.selectedTab=="ALL") { 
                $scope.scheduleTabColour='rgba(247, 200, 0, 0.5)'
        } else if($scope.selectedTab=="BOOKED") {
                $scope.bookedTabColour='rgba(247, 200, 0, 0.5)'
        }



});