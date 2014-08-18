bbb.factory('NotificationService', ["$rootScope", "$state", "$location", "ParseService", function($rootScope, $state, $location, ParseService) {                      

        window.gotMsg = function (e) {

                if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){ 
                        switch( e.event )
                        {
                                case 'registered':
                                        if ( e.regid.length > 0 )
                                        {
                                                Parse.User.current().set("token", "a"+e.regid).save()                                                
                                        }
                                        break;

                                case 'message':
                                        try {
                                                _add({
                                                        "title": e.message.substring(0,e.message.indexOf("about")),                                                        
                                                        "message": e.payload.payload.messageID, //e.message.substring(e.message.indexOf("about")),
                                                        "link": '$state.href("message", {id:e.messageID})'
                                                })
                                        } catch (ex) { alert(ex) }

                                        break;

                                case 'error':
                                        alert('GCM error = '+e.msg);
                                        break;

                                default:
                                        alert('An unknown GCM event has occurred');
                                        break;
                        }
                } else {

                        _add({
                                "title": e.alert.substring(0,e.alert.indexOf("about")),                                                        
                                "message": e.alert.substring(e.alert.indexOf("about")),
                                "link": $state.href("message", {id:e.messageID})
                        })

                }
                $rootScope.$apply()
        }       

        var _pushNotifications = {
                initialise: function() {
                        if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){

                                window.plugins.pushNotification.register(
                                        _pushNotifications.successHandler,
                                        _pushNotifications.errorHandler,
                                        {
                                                "senderID":"422402149973",
                                                "ecb":"window.gotMsg"
                                        });
                        } else {
                                window.plugins.pushNotification.register(
                                        _pushNotifications.tokenHandler,
                                        _pushNotifications.errorHandler,
                                        {
                                                "badge":"true",
                                                "sound":"true",
                                                "alert":"true",
                                                "ecb":"window.gotMsg"
                                        });
                        }

                },
                successHandler: function() {
                },
                errorHandler: function() {
                        alert("error")
                },
                tokenHandler: function(result) {
                        Parse.User.current().set("token", "i"+result).save()        
                }
        }        




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
        if (window.plugin) {
                _hookUpEventListeners();
                _pushNotifications.initialise();
        }
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

                                if(window.plugin) {             

                                        window.plugin.notification.local.add({
                                                id:         iteration.id,  // A unique id of the notifiction
                                                date:      moment(iteration.time).subtract('minutes',10)._d,
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