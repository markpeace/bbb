angular.element(document).ready(function() {
  angular.bootstrap(document, ["bbb"]);
});

var bbb = angular.module('bbb', ['ionic', 'monospaced.qrcode'])
.run(function($rootScope, ParseService, $location, $state) {
  
  $rootScope.currentUser = Parse.User.current();
   
});