bbb.controller('Login', function($scope, $ionicLoading, ParseService, $rootScope, $state, $location) { 
  
  $scope.loginUser = { username: '', password: ''}
  
  $scope.signIn = function () {
    
    $scope.loading = $ionicLoading.show({
      content: 'Loading',
    });
    
    Parse.User.logIn($scope.loginUser.username, $scope.loginUser.password, {
      success: function(user) {
        
        $rootScope.currentUser = user;

        $scope.loading.hide();
        //$location.path('/tabs/schedule').replace();
        
        $state.go("tabs.schedule");
      },
      error: function(user, error) {
        $scope.loading.hide();
        alert("Unable to sign in:  "  + error.message);      }
    });
    
  }
  
});