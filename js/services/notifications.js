bbb.factory('NotificationService', ["$rootScope", function($rootScope) {                      

        var _hookUpEventListeners = function () {
                window.plugin.notification.local.onclick = function (id, state, json) {
                        alert("the user clickified the notification: "+id)
                };

        }

        _notifications = []
        _unreadNotifications=0
        var _initialiseNotificationCache = function () {
                _notifications = localStorage.getItem(Parse.User.current().id + "_notifications")
                _notifications = _notifications ? _notifications : []
                angular.forEach(_notifications, function(notification) {
                        if (!notification.read) _unreadNotifications++
                                })
        }


        //RUN ONE TIME ONLY INITIALISATION

        _initialiseNotificationCache()       
        if (window.plugin) _hookUpEventListeners();
        _notifications = [
                {title: "Event Reminder", message: "the event occurs at 10:00 today", read:false, link:"/" },
                {title: "Event Reminder", message: "the event occurs at 10:00 today", read:false, link:"/" },
                {title: "Event Reminder", message: "the event occurs at 10:00 today", read:false, link:"/" },
                {title: "Event Reminder", message: "the event occurs at 10:00 today", read:true, link:"/" },
                {title: "Event Reminder", message: "the event occurs at 10:00 today", read:true, link:"/" }
        ]


        return {
                
                unread: function() {
                        u=0
                        angular.forEach(_notifications, function(n) {
                                if (!n.read) u++
                        })
                        return u
                },
                
                notifications: function() { return _notifications; },
                
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
                                //badge:      1,  // Displays number badge to notification
                                json:       { mark: "peace" },  // Data to be passed through the notification
                        });

                }
        }

}]);