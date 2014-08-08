bbb.controller('ListNotifications', function($state, $scope, ParseService) { 
        $scope.dummyData=[
                { header:"Header", text: "text goes here" },
                { header:"Header", text: "text goes here" },
                { header:"Header", text: "text goes here" },
                { header:"Header", text: "text goes here" },
                { header:"Header", text: "text goes here" },
                { header:"Header", text: "text goes here" },
                { header:"Header", text: "text goes here" }               
        ]


        try {
        window.plugin.notification.local.add({
                id:         "test",  // A unique id of the notifiction
                date:       moment().add("second",10),    // This expects a date object
                message:    "hello this is a test",  // The message that is displayed
                title:      "test notifier",  // The title of the message
                //repeat:     String,  // Either 'secondly', 'minutely', 'hourly', 'daily', 'weekly', 'monthly' or 'yearly'
                badge:      2,  // Displays number badge to notification
                //sound:      String,  // A sound to be played
                //json:       String,  // Data to be passed through the notification
                //autoCancel: Boolean, // Setting this flag and the notification is automatically canceled when the user clicks it
                //ongoing:    Boolean, // Prevent clearing of notification (Android only)
        }, callback, scope);
        } catch (ex) {
                alert(ex)
        }
});