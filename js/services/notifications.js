bbb.factory('NotificationService', ["$rootScope", "$state", "$location", function($rootScope, $state, $location) {                      

        var _hookUpEventListeners = function () {

                window.plugin.notification.local.ontrigger = function (id, state, json) { 
                        _add(JSON.parse(json))

                        $rootScope.$apply();                                

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
                        return _unread();
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

                                //iteration.time=moment().add('minutes', 10).add('seconds',20)                                                               

                                if(window.plugin) {             

                                        console.log("started")
                                        console.log(iteration.time.subtract('minutes',10)._d)

                                        window.plugin.notification.local.add({
                                                id:         iteration.id,  // A unique id of the notifiction
                                                date:      moment(iteration.time).subtract('minutes',10)._d,
                                                message:    "A pop-up you are booked into ("+ iteration.event.title +") starts in ten minutes",  // The message that is displayed
                                                json:       JSON.stringify({ 
                                                        "title":"Event Reminder!",
                                                        "message":"A pop-up you are booked into ("+ iteration.event.title +") starts in ten minutes",
                                                        "link": $state.href("viewEvent", {id:iteration.id })}),  // Data to be passed through the notification
                                        });

                                        console.log("ended")

                                }
                        }
                }
        }

}]);