if (navigator.appName == 'Microsoft Internet Explorer') {
        alert("Apologies, but the Birley Big Bang app doesn't work very well on Internet Explorer. \n\n Try using an alternative browser such as Chrome or Firefox - or, even better, download our app from the apple or android stores")        
}


if (typeof cordova === 'object') {
        document.addEventListener("deviceready", function() {

                angular.bootstrap(document, ["bbb"]);    



        });

} else {        
        angular.element(document).ready(function() {
                angular.bootstrap(document, ["bbb"]);
        });
}

var bbb = angular.module('bbb', ['ionic', 'monospaced.qrcode'])

.run(function($rootScope, ParseService, $location, $state) {

        $rootScope.currentUser = Parse.User.current();              

});