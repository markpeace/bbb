if (typeof cordova === 'object') {
        document.addEventListener("deviceready", function() {
                angular.bootstrap(document, ["bbb"]);        

                alert("updated2")

                function tokenHandler (result) {
                        // Your iOS push server needs to know the token before it can push to this device
                        // here is where you might want to send it the token for later use.
                        alert('device token = ' + result);
                }

                function successHandler (result) {
                        alert('result = ' + result);
                }

                function errorHandler (error) {
                        alert('error = ' + error);
                }

                function onNotificationAPN (event) {
                        if ( event.alert )
                        {
                                navigator.notification.alert(event.alert);
                        }               

                        if ( event.badge )
                        {
                                pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
                        }
                }

                function onNotification(e) {
                        $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

                        switch( e.event )
                        {
                                case 'registered':
                                        if ( e.regid.length > 0 )
                                        {                                               
                                                alert("regID = " + e.regid);
                                        }
                                        break;

                                case 'message':
                                        // if this flag is set, this notification happened while we were in the foreground.
                                        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                                        if ( e.foreground )
                                        {
                                                alert("inline notifcation")                                                
                                        }
                                        else
                                        {  // otherwise we were launched because the user touched a notification in the notification tray.
                                                if ( e.coldstart )
                                                {
                                                        console.log("coldstart notification")
                                                }
                                                else
                                                {
                                                        console.log("background notification")
                                                }
                                        }

                                        alert(e.payload.message + e.payload.msgcnt)

                                        break;

                                case 'error':
                                        alert('<li>ERROR -> MSG:' + e.msg + '</li>');
                                        break;

                                default:
                                        alert('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                                        break;
                        }
                }

                if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){

                        pushNotification.register(
                                successHandler,
                                errorHandler,
                                {
                                        "senderID":"replace_with_sender_id",
                                        "ecb":"onNotification"
                                });
                } else {
                        pushNotification.register(
                                tokenHandler,
                                errorHandler,
                                {
                                        "badge":"true",
                                        "sound":"true",
                                        "alert":"true",
                                        "ecb":"onNotificationAPN"
                                });
                }                


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