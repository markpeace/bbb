bbb.controller('Tab', function($scope, ParseService, $ionicModal, $rootScope) { 
  $ionicModal.fromTemplateUrl('pages/settings.html', function($ionicModal) {
    $scope.settingsModal = $ionicModal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });  
  
  $scope.signOut = function () {
    Parse.User.logOut();
    $rootScope.currentUser=null;
    window.location.assign("/")
  }
  
});