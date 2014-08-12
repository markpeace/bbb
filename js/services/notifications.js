bbb.factory('NotificationService', ["$rootScope", "$state", function($rootScope, $state) {                      

        var _hookUpEventListeners = function () {
                try {
                                window.plugin.notification.local.oncancel = function (id, state, json) { alert("cancelled")};     
                                window.plugin.notification.local.onadd = function (id, state, json) { alert("added")};

                } catch(ex) {
                        alert(ex)
                }
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
        _add = function(notification) {
                newNotifications=[notification]
                angular.forEach(_notifications, function(n) { newNotifications.push(n) })
                _notifications=newNotifications
        }


        //RUN ONE TIME ONLY INITIALISATION

        _initialiseNotificationCache()       
        if (window.plugin) _hookUpEventListeners();
        _notifications = []


        return {

                notifications: function() { return _notifications; },

                unread: function() {
                        u=0
                        angular.forEach(_notifications, function(n) {
                                if (!n.read) {u++}
                        })
                        return u
                },

                add: function(notification) { _add(notification) },

                markAllRead: function () {
                        angular.forEach(_notifications, function(n) {
                                n.read=true
                        })     
                },

                reminders: {

                        destroyAll: function () {
                                if(window.plugin) {
                                        console.log("Destroy all currently set notifications");
                                        window.plugin.notification.local.cancelAll(function () {});
                                }

                        },
                        destroy: function(iteration){
                                if(window.plugin) {
                                        window.plugin.notification.local.cancel(iteration.id, function () {
                                                console.log("destroy reminder for...")
                                                console.log(iteration)     
                                        });
                                }

                        },
                        set: function (iteration) {

                                if(window.plugin) {       

                                                console.log("set reminder for...")
                                                console.log(iteration)

                                                var now                  = new Date().getTime(),
                                                    _10_seconds_from_now = new Date(now + 10*1000);


                                                window.plugin.notification.local.add({
                                                        id:         iteration.id,  // A unique id of the notifiction
                                                        date:       _10_seconds_from_now,    // This expects a date object
                                                        message:    "A pop-up you are booked into ("+ iteration.event.title +") starts in ten minutes",  // The message that is displayed
                                                        //json:       { title: "Event Reminder!", message: "this.message", link: $state.href("viewEvent", {id:iteration.id }) },  // Data to be passed through the notification
                                                });

                                }
                        }
                }
        }

}]);