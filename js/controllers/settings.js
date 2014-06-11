bbb.controller('Settings', function($scope, ParseService, $state) { 

	$scope.user=Parse.User.current();

        $scope.signOut = function () {
                Parse.User.logOut();
                $state.go("login");
        }

});