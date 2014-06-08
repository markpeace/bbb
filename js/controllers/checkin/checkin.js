bbb.controller('CheckIn', function($scope, $state, ParseService, cordovaCamera) { 

        try {

                var scanner = cordova.require("cordova/plugin/BarcodeScanner");

                scanner.scan( function (result) { 

                        console.log("scanned")

                        new Parse.Query(Parse.Object.extend("Iteration"))
                        .get(result.text).then(function(iteration) {


                                new Parse.Query(Parse.Object.extend("Checkin"))
                                .equalTo("iteration", iteration).equalTo("user",Parse.User.current())
                                .count().then(function(c) {

                                        if(c==0) {

                                                var Checkin = Parse.Object.extend("Checkin");
                                                checkin = new Checkin(); 

                                                checkin.save({
                                                        user: Parse.User.current(),
                                                        iteration: iteration                                       
                                                })

                                        }
                                })




                        })

                        $state.go("tabs.schedule")  

                } );



        } catch (ex) {
                console.log("error" + ex)
        }


});