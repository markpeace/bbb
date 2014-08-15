function initPushwoosh() {       

        alert("pushwoosh")

        try {
                
                var pushNotification = window.plugins.pushNotification;

                //set push notification callback before we initialize the plugin
                document.addEventListener('push-notification', function(event) {
                        //get the notification payload
                        var notification = event.notification;

                        //display alert to the user for example
                        alert(notification.aps.alert);

                        //clear the app badge
                        pushNotification.setApplicationIconBadgeNumber(0);
                });

                //initialize the plugin
                pushNotification.onDeviceReady({pw_appid:"3FD7A-0CF27"});

                //register for pushes
                alert("about to register")
                pushNotification.registerDevice(
                        function(status) {
                                alert("yes")                                
                                var deviceToken = status['deviceToken'];
                                console.warn('registerDevice: ' + deviceToken);
                                alert('registerDevice: ' + deviceToken);
                        },
                        function(status) {
                                alert("no")
                                console.warn('failed to register : ' + JSON.stringify(status));
                                alert(JSON.stringify(['failed to register ', status]));
                        }
                );
                alert("registered")

                //reset badges on app start
                pushNotification.setApplicationIconBadgeNumber(0);
        } catch (ex) { alert(ex)}
}


if (typeof cordova === 'object') {
        document.addEventListener("deviceready", function() {

                angular.bootstrap(document, ["bbb"]);        

                alert("start")

                initPushwoosh();


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