console.log (typeof(cordova))

if (typeof cordova === 'object') {
        try {
                document.addEventListener("deviceready", function() {
                        angular.bootstrap(document, ["bbb"]);
                        console.log("cordova intialised!")
                }, false);
        } catch (ex) {
                console.log(ex)
        }
} else {        
        angular.element(document).ready(function() {
                //angular.bootstrap(document, ["bbb"]);
        });
}

var bbb = angular.module('bbb', ['ionic', 'monospaced.qrcode'])
.run(function($rootScope, ParseService, $location, $state) {

        $rootScope.currentUser = Parse.User.current();

});