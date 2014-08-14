if (typeof cordova === 'object') {
        document.addEventListener("deviceready", function() {

                angular.bootstrap(document, ["bbb"]);        

                function onNotification() {
                        alert("hi")
                }
                
                var _pushNotifications = {
                        initialise: function() {
                                
                                console.log("Init1")
                                
                                window.plugins.pushNotification.register(
                                        _pushNotifications.tokenHandler,
                                        _pushNotifications.errorHandler,
                                        {
                                                "badge":"true",
                                                "sound":"true",
                                                "alert":"true",
                                                "ecb":"onNotification"
                                        });

                        },
                        successHandler: function() {
                                alert("success")
                        },
                        errorHandler: function() {
                                alert("error")
                        },
                        tokenHandler: function(result) {
                                alert(result)                
                        }
                }        

                _pushNotifications.initialise();

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