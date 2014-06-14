bbb.service('ParseService', [function() {                       
        
        if(typeof cordova === 'object' && typeof window.WeinreServerId === "undefined") {
                var app_id = "iBkDfDqzMHb2gW1ClfLTwziKkmWrAZ5MyzKmwJwl";
                var js_key = "GkXjZw5hVYBOxo2RGOzSNKzgfCGKngYHBRdAs1Ir";
                
                Parse.usingTestServer = false;
        } else {
                var app_id = "5AVRZlfOuSAo8cp3eeOQCMP4UmttbPKJsMzFgjqr";
                var js_key = "87yScqAIX6TvH333YF0LrJ7gnX4trGFc7j5QsedH";
                
                Parse.usingTestServer = true;
        }
        
        Parse.initialize(app_id, js_key);

}]);