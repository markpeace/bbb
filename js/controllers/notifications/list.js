bbb.controller('ListNotifications', function($state, $scope, NotificationService, ParseService) { 
        $scope.notifications=NotificationService.notifications()

        $scope.$on("$destroy", function(){
                console.log("away")
        });
        
        console.log(NotificationService.unread())
    
});