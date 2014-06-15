bbb.service('ParseService', [function() {                       
        
        Parse.usingTestServer = true;
        if(typeof cordova === 'object' && typeof window.WeinreServerId === "undefined") { Parse.usingTestServer = false; }        
        if(window.location.host=="www.birleybigbang.com") { Parse.usingTestServer=false}
        
        if(Parse.usingTestServer == false) {
                var app_id = "iBkDfDqzMHb2gW1ClfLTwziKkmWrAZ5MyzKmwJwl";
                var js_key = "GkXjZw5hVYBOxo2RGOzSNKzgfCGKngYHBRdAs1Ir";                
        } else {
                var app_id = "5AVRZlfOuSAo8cp3eeOQCMP4UmttbPKJsMzFgjqr";
                var js_key = "87yScqAIX6TvH333YF0LrJ7gnX4trGFc7j5QsedH";
                
                
        }
        
        Parse.initialize(app_id, js_key);

}]);