if (typeof cordova === 'object') {
        document.addEventListener("deviceready", function() {
                angular.bootstrap(document, ["bbb"]);
                console.log("cordova intialised!")
        }, false);

} else {        
        angular.element(document).ready(function() {
                angular.bootstrap(document, ["bbb"]);
        });
}

var bbb = angular.module('bbb', ['ionic', 'monospaced.qrcode', 'ng-cordova'])

.run(function($rootScope, ParseService, $location, $state) {

        $rootScope.currentUser = Parse.User.current();


        try {

                document.addEventListener("offline", onOffline, false);

                function onOffline() {
                        alert($state.current.name)
                        console.log("mark")
                        console.log($state.current.name)
                }
                
        } catch (ex) {
                console.log(ex)
        }


});