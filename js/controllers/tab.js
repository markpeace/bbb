bbb.controller('Tab', function($scope, ParseService, $ionicModal, $state, $rootScope, NotificationService) { 

        $scope.usingTestServer = Parse.usingTestServer
        if (typeof cordova === 'object') { $scope.checkinEnabled=true }

        $ionicModal.fromTemplateUrl('pages/settings.html', function($ionicModal) {
                $scope.settingsModal = $ionicModal;
        }, {
                scope: $scope,
                animation: 'slide-in-up'
        });  
        
        $scope.notifications=NotificationService

});