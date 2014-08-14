if (typeof cordova === 'object') {
        document.addEventListener("deviceready", function() {
                angular.bootstrap(document, ["bbb"]);        

                var _pushNotifications = {
                        initialise: function() {
                                alert("initialised")
                                try {
                                        if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
                                                window.plugins.pushNotification.register(
                                                        _pushNotifications.successHandler,
                                                        _pushNotifications.errorHandler,
                                                        {
                                                                "senderID":"replace_with_sender_id",
                                                                "ecb":"_pushNotifications.onNotification"
                                                        });
                                        } else {
                                                window.plugins.pushNotification.register(
                                                        _pushNotifications.tokenHandler,
                                                        _pushNotifications.errorHandler,
                                                        {
                                                                "badge":"true",
                                                                "sound":"true",
                                                                "alert":"true",
                                                                "ecb":"_pushNotifications.onNotification"
                                                        });
                                        }
                                } catch(ex) { alert(ex) }
                        },
                        successHandler: function() {
                                alert("success")
                        },
                        errorHandler: function() {
                                alert("error")
                        },
                        tokenHandler: function(result) {
                                //Parse.User.current().set("token", result).save()  
                                alert(result)                      
                        },
                        onNotification: function() {
                                alert("onNotification")
                        },
                        onNotificationAPN: function() {
                                alert("onNotificationAPN")
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