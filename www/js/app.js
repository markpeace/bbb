var bbb = angular.module('bbb', ['ionic'])
.run(function($rootScope, ParseService) {
  
  $rootScope.currentUser = Parse.User.current();
  
});