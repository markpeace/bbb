bbb.factory('NotificationService', ["ParseService", "$ionicLoading","$rootScope","$state", function(ParseService, $ionicLoading, $rootScope, $state) {                      

        newNotifications=10

        if (window.plugin) {
                window.plugin.notification.local.onclick = function (id, state, json) {
                        alert("the user clickified the notification: "+id)
                };

                window.plugin.notification.local.ontrigger = function (id, state, json) {

                        if (json) window.plugin.notification.local.add({
                                id:         "badge",  // A unique id of the notifiction
                                badge:      100,  // Displays number badge to notification
                        });

                };

        }

        return {
                destroyAll: function () {
                        console.log("Destroy all currently set notifications");
                        window.plugin.notification.local.cancelAll(function () {});

                },
                destroy: function(iteration){

                        window.plugin.notification.local.cancel(iteration.id, function () {
                                console.log("destroy reminder for...")
                                console.log(iteration)     
                        });


                },
                set: function (iteration) {
                        console.log("set reminder for...")
                        console.log(iteration)

                        var now                  = new Date().getTime(),
                            _10_seconds_from_now = new Date(now + 10*1000);


                        window.plugin.notification.local.add({
                                id:         iteration.id,  // A unique id of the notifiction
                                date:       _10_seconds_from_now,    // This expects a date object
                                message:    "A pop-up you are booked into ("+ iteration.event.title +") starts in ten minutes",  // The message that is displayed
                                badge:      1,  // Displays number badge to notification
                                json:       { mark: "peace" },  // Data to be passed through the notification
                        });

                }
        }

}]);