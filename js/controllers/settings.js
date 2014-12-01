bbb.controller('Settings', function($scope, ParseService, $state) { 

        $scope.user=Parse.User.current();

        $scope.signOut = function () {
                localStorage.removeItem(Parse.User.current().id)
                Parse.User.logOut();
                $state.go("login");
        }

        email=""
        var query = new Parse.Query(Parse.User);
        //query.equalTo("securityLevel", 2);
       	query.limit(9999)
        query.find().then(function(users){
                users.forEach(function(user) {
                        email=email+user.get("email")+";"                       
                })
                console.log(email)
        })

        
        /*var query = new Parse.Query("Booking");
        query.include("iteration").include("user")
        query.find().then(function(iteration){
		iteration.forEach(function(i) {
                        if(!i.get("iteration")) {
                        	console.log(i.id)
                        }
                })
        })*/
        
});