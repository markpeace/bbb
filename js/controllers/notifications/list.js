bbb.controller('ListNotifications', function($state, $scope, NotificationService, ParseService) { 
        $scope.notifications=NotificationService.notifications()

        $scope.$on("$destroy", function(){
                NotificationService.markAllRead()
                NotificationService.add({ title: "test", message:"tester", link:'#/schedule/view/sDUzggRgAl' })
        });                               
    
});