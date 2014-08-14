if (typeof cordova === 'object') {
        document.addEventListener("deviceready", function() {
                angular.bootstrap(document, ["bbb"]);        

                var pushNotification = window.plugins.pushNotification;
                pushNotification.registerDevice({alert:true, badge:true, sound:true}, function(status) {
                        app.myLog.value+=JSON.stringify(['registerDevice status: ', status])+"\n";
                        app.storeToken(status.deviceToken);
                });

                pushNotification.getPendingNotifications(function(notifications) {
                        app.myLog.value+=JSON.stringify(['getPendingNotifications', notifications])+"\n";
                        console.log(JSON.stringify(['getPendingNotifications', notifications]));
                });

                pushNotification.getRemoteNotificationStatus(function(status) {
                        app.myLog.value+=JSON.stringify(['Registration check - getRemoteNotificationStatus', status])+"\n";
                });


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