bbb.service('ParseService', [function() {       
        
        if(typeof cordova === 'object') {
                var app_id = "iBkDfDqzMHb2gW1ClfLTwziKkmWrAZ5MyzKmwJwl";
                var js_key = "GkXjZw5hVYBOxo2RGOzSNKzgfCGKngYHBRdAs1Ir";
        } else {
                var app_id = "5AVRZlfOuSAo8cp3eeOQCMP4UmttbPKJsMzFgjqr";
                var js_key = "87yScqAIX6TvH333YF0LrJ7gnX4trGFc7j5QsedH";                
        }
        
        alert(window.WeinreServerId);

        Parse.initialize(app_id, js_key);


}]);