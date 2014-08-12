bbb.factory('NotificationService', ["$rootScope", "$state", "$location", function($rootScope, $state, $location) {                      

        var _hookUpEventListeners = function () {

                window.plugin.notification.local.ontrigger = function (id, state, json) { 
                        if (json) {

                                _add(JSON.parse(json))

                                /*window.plugin.notification.local.add({
                                        id:         "badge",
                                        date:       new Date().getTime(),    // This expects a date object
                                        badge:		unread()
                                });*/					// <-Doesn't work because I can't run in background 

                                $rootScope.$apply();                                

                        } else {

                        }
                };

                window.plugin.notification.local.onclick = function (id, state, json) { 
                        json=JSON.parse(json)
                        json.link=json.link.substring(1)
                        json.read=true
                        _add(json)                        
                        $location.path(json.link)
                        $rootScope.$apply();
                };

        }

        _notifications = []

        var _initialiseNotificationCache = function () {
                _notifications = localStorage.getItem(Parse.User.current().id + "_notifications")
                _notifications = _notifications ? _notifications : []
                angular.forEach(_notifications, function(notification) {
                        if (!notification.read) _unreadNotifications++
                                })
        }
        _unread = function() {
                u=0
                angular.forEach(_notifications, function(n) {
                        if (!n.read) {u++}
                })
                return u
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
                        return _unread;
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

                                        alert(moment(iteration.time).subtract('minutes', 10)._d)
                                        
                                        var now                  = new Date().getTime(),
                                            _10_seconds_from_now = new Date(now + 10*1000);

                                        window.plugin.notification.local.add({
                                                id:         iteration.id,  // A unique id of the notifiction
                                                date:       _10_seconds_from_now,    // This expects a date object
                                                message:    "A pop-up you are booked into ("+ iteration.event.title +") starts in ten minutes",  // The message that is displayed
                                                json:       JSON.stringify({ 
                                                        "title":"Event Reminder!",
                                                        "message":"A pop-up you are booked into ("+ iteration.event.title +") starts in ten minutes",
                                                        "link": $state.href("viewEvent", {id:iteration.id })}),  // Data to be passed through the notification
                                        });


                                }
                        }
                }
        }

}]);