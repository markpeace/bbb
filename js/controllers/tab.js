bbb.controller('Tab', function($scope, ParseService, $ionicModal, $state, $rootScope, EventModel, NotificationService) { 
        
        $scope.usingTestServer = Parse.usingTestServer
        if (typeof cordova === 'object') { $scope.checkinEnabled=true }

        if(Parse.User.current().get("securityLevel")==1) { $scope.isAdmin=true }
        $scope.setting=EventModel.data().Setting
        
        $ionicModal.fromTemplateUrl('pages/settings.html', function($ionicModal) {
                $scope.settingsModal = $ionicModal;
        }, {
                scope: $scope,
                animation: 'slide-in-up'
        });  
        
        $scope.notifications=NotificationService

});