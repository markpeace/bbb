bbb.controller('Login', function($scope, $ionicLoading, ParseService, $state) { 
  
  $scope.loginUser = { username: '', password: ''}
  
  $scope.signIn = function () {
    
    $scope.loading = $ionicLoading.show({
      content: 'Loading',
    });
    
    Parse.User.logIn($scope.loginUser.username, $scope.loginUser.password, {
      success: function(user) {
        $scope.currentUser = user;
        $scope.$apply(); // Notify AngularJS to sync currentUser
        $state.go('tabs.schedule')
        $scope.loading.hide();
      },
      error: function(user, error) {
        $scope.loading.hide();
        alert("Unable to sign in:  "  + error.message);      }
    });
    
  }
  
});