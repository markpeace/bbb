bbb.controller('Login', function($scope, $ionicLoading, ParseService, $rootScope, $state, $location, NotificationService) { 
        $scope.userCount = "45"
        var User = Parse.Object.extend("User");
        var query = new Parse.Query(User);
        query.count({
                success: function(count) {      
                        $scope.userCount = count    
                        $scope.$apply();      
                }
        });

        $scope.loginUser = { username: '', password: ''}

        $scope.signIn = function () {

                $scope.loading = $ionicLoading.show({
                        content: 'Loading',
                });

                Parse.User.logIn($scope.loginUser.username, $scope.loginUser.password, {
                        success: function(user) {

                                $rootScope.currentUser = user;
                               	NotificationService.initialisePushNotifications();

                                $scope.loading.hide();

                                $state.go("tabs.schedule");

                        },
                        error: function(user, error) {
                                $scope.loading.hide();
                                alert("Unable to sign in:  "  + error.message + "\n\nPlease note that you have to register to use the app using the button on this page, if you haven't already - it won't link automatically to your MMU account" );      }
                });

        }

        $scope.resetPassword = function () {
                if ($scope.loginUser.username=="") {
                        alert("Please provide your email address in the field above and click this link again")
                        return
                }

                Parse.User.requestPasswordReset($scope.loginUser.username, {
                        success: function() {
				alert("A link has been sent to your email address to reset your pasword")
                        },
                        error: function(error) {
                                // Show the error message somewhere
                                alert("Sorry, we couldn't find your email address. \n\nPlease note that you have to register to use the app using the button on this page, if you haven't already - it won't link automatically to your MMU account");
                        }
                });

        }

});