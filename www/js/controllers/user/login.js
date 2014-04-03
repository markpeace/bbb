bbb.controller('Login', function($scope, $ionicLoading, ParseService, $rootScope, $state) { 
    
  $scope.loginUser = { username: '', password: ''}
  
  $scope.signIn = function () {
    
    $scope.loading = $ionicLoading.show({
      content: 'Loading',
    });
    
    Parse.User.logIn($scope.loginUser.username, $scope.loginUser.password, {
      success: function(user) {
        $rootScope.currentUser = user;
        $scope.$apply(); // Notify AngularJS to sync currentUser
        
        if (!user.emailVerified) {
          alert ("You need to confirm your email address before you can fully use the app - please check your mmu account");
          user.set("email", user.get("email"))
          user.save()
        }
        
        window.location.assign("#/tabs/schedule")
        $scope.loading.hide();
      },
      error: function(user, error) {
        $scope.loading.hide();
        alert("Unable to sign in:  "  + error.message);      }
    });
    
  }
  
});