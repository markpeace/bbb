if (typeof cordova === 'object') {
        document.addEventListener("deviceready", function() {
                angular.bootstrap(document, ["bbb"]);
                console.log("cordova intialised!")

                navigator.notification.alert("Sorry, you are offline.", function() {}, "Offline!");
                
                document.addEventListener("deviceready", init, false);

                function init() {
                        document.addEventListener("online", toggleCon, false);
                        document.addEventListener("offline", toggleCon, false);

                        if(navigator.network.connection.type == Connection.NONE) {
                                navigator.notification.alert("Sorry, you are offline.", function() {}, "Offline!");
                        } else {
                                setupButtonHandler();
                        }

                }

                function toggleCon(e) {
                        console.log("Called",e.type);
                        if(e.type == "offline") {
                                $("#searchBtn").off("touchstart").attr("disabled","disabled");
                                navigator.notification.alert("Sorry, you are offline.", function() {}, "Offline!");
                        } else {
                                $("#searchBtn").removeAttr("disabled");
                                navigator.notification.alert("Woot, you are back online.", function() {}, "Online!");
                                setupButtonHandler();
                        }
                }



        }, false);

} else {        
        angular.element(document).ready(function() {
                angular.bootstrap(document, ["bbb"]);
        });
}

var bbb = angular.module('bbb', ['ionic', 'monospaced.qrcode', 'ng-cordova'])

.run(function($rootScope, ParseService, $location, $state) {

        $rootScope.currentUser = Parse.User.current();              

});