bbb.controller('Settings', function($scope, ParseService, $state) { 

	$scope.user=Parse.User.current();

        $scope.signOut = function () {
                localStorage.removeItem(Parse.User.current().id)
                Parse.User.logOut();
                $state.go("login");
        }

});