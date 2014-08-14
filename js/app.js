if (typeof cordova === 'object') {
        document.addEventListener("deviceready", function() {
                
                angular.bootstrap(document, ["bbb"]);        

                window._pushNotifications = {
                        initialise: function() {
                                alert("initialised3")

                                window.plugins.pushNotification.register(
                                        window._pushNotifications.tokenHandler,
                                        window._pushNotifications.errorHandler,
                                        {
                                                "badge":"true",
                                                "sound":"true",
                                                "alert":"true",
                                                "ecb":"window._pushNotifications.onNotification"
                                        });


                        },
                        tokenHandler: function(result) {
                                //Parse.User.current().set("token", result).save()  
                                alert(result)                      
                        },
                        onNotification: function() {
                                alert("onNotification")
                        }

                }        

                _pushNotifications.initialise()


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