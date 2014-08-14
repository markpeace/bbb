var http = require('http');
var apn = require('apn');
var url = require('url');
 
var myPhone = "31d6a15a8c2fe3278104d4ec2a641b39fce2a8ffbb393701ff2c28c52bf3dda5";
var myiPad = "31d6a15a8c2fe3278104d4ec2a641b39fce2a8ffbb393701ff2c28c52bf3dda5";
 
var myDevice = new apn.Device(myPhone);
 
var note = new apn.Notification();
note.badge = 1;
note.sound = "notification-beep.wav";
note.alert = { "body" : "Your turn!", "action-loc-key" : "Play" , "launch-image" : "mysplash.png"};
note.payload = {'messageFrom': 'Holly'};
 
note.device = myDevice;
 
var callback = function(errorNum, notification){
    console.log('Error is: %s', errorNum);
    console.log("Note " + notification);
}
var options = {
    gateway: 'gateway.sandbox.push.apple.com', // this URL is different for Apple's Production Servers and changes when you go to production
    errorCallback: callback,
    cert: 'PushNotificationSampleCert.pem',                 
    key:  'PushNotificationSampleKey.pem',                 
    passphrase: 'myPassword',                 
    port: 2195,                       
    enhanced: true,                   
    cacheLength: 100                  
}
var apnsConnection = new apn.Connection(options);
apnsConnection.sendNotification(note);