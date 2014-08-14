if (typeof cordova === 'object') {
        document.addEventListener("deviceready", function() {

                angular.bootstrap(document, ["bbb"]);        

                var successHandler = function() {
                        alert("success")
                }
                var errorHandler = function() {
                        alert("error")
                }
                var tokenHandler = function(result) {
                        alert(result)                
                }

                var onNotification = function() {
                        alert("gorrit")
                }

                var initialise = function() {

                        alert("Init1")

                        window.plugins.pushNotification.register(
                                tokenHandler,
                                errorHandler,
                                {
                                        "badge":"true",
                                        "sound":"true",
                                        "alert":"true",
                                        "ecb":"onNotification"
                                });
                }

                initialise();

        }, false);

} else {        
        angular.element(document).ready(function() {
                angular.bootstrap(document, ["bbb"]);
        });
}

var bbb = angular.module('bbb', ['ionic', 'monospaced.qrcode'])

.run(function($rootScope, ParseService, $location, $state) {

        $rootScope.currentUser = Parse.User.current();              

});