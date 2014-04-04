var bbb = angular.module('bbb', ['ionic'])
.run(function($rootScope, ParseService, $location) {
  
  //$rootScope.currentUser = Parse.User.current();
  
  //FOR NOW JUST LOG IN AS THE FIRST USER
  var User = Parse.Object.extend("User");
  var query = new Parse.Query(User);
  query.equalTo("email", "m.peace@mmu.ac.uk");

  query.find({
    success: function(user) {      
      $rootScope.currentUser=user[0]
      return $location.path('/login');
    }
  });
  
});