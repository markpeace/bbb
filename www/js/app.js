//Define an angular module for our app
var xyxxy = angular.module('xyxxy', [
  'ngRoute', 
  'ionic'
])

.run(function($rootScope) {
  $rootScope.leftButtons = [
    { 
      type: 'button-positive',
      content: '<i class="icon ion-navicon"></i>',
      tap: function(e) {
      }
    }
  ]
} );