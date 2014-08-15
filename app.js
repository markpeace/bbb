document.addEventListener("deviceready", function() {
        alert("ready")

        var successHandler = function() {
                alert("success")
        }
        var errorHandler = function() {
                alert("error")
        }
        var tokenHandler = function(result) {
                alert(result)                
        }

        var onNotification = function() {
                alert("gorrit")
        }

        var initialise = function() {

                window.plugins.pushNotification.register(
                        tokenHandler,
                        errorHandler,
                        {
                                "badge":"true",
                                "sound":"true",
                                "alert":"true",
                                "ecb":"onNotification"
                        });
        }

        initialise();

});
