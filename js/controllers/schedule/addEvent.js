bbb.controller('AddEvent', function($scope, $state,  $stateParams,  ParseService) { 


        var getReferencedData = function () {                                                        // GET DATA FROM OTHER TABLES AS NEEDED
                $scope.relatedData=[]

                queryData = [
                        { tableName: 'Series' }
                ]      

                for (t in queryData) {

                        new Parse.Query(Parse.Object.extend(queryData[t].tableName))
                        .find().then(function(result) {
                                $scope.relatedData[queryData[t].tableName]=result                                                              
                        }).then(function () {
                                $scope.$apply()
                                if (t==queryData.length-1) { getFocalRecord() }                                                                
                        })

                }                 
        }

        var getFocalRecord = function () {                                                           // EITHER RETRIEVES OR CREATES A RECORD
                new Parse.Query(Parse.Object.extend("Event"))
                .include("series")
                .get($stateParams.id)
                .then(function(result) {

                        series = null

                        angular.forEach($scope.relatedData['Series'], function (value) { if (value.id==result.get('series').id) { series=value }  })   

                        $scope.event={  
                                object: result,
                                title: result.get('title'),
                                description:result.get('description'),
                                series:series,
                                iterations: []
                        }

                        new Parse.Query(Parse.Object.extend("Iteration"))
                        .equalTo("event", result)
                        .find().then(function(iterations) {
                                angular.forEach(iterations, function(iteration) {
                                        $scope.event.iterations.push({
                                                object:iteration,
                                                time: iteration.get("time"),
                                                host: iteration.get("host"),
                                                location: iteration.get("location")         
                                        })
                                })
                                $scope.$apply();        
                        })                                                


                }, function (result) {
                        var Event = Parse.Object.extend("Event");
                        var event = new Event().save()
                        .then(function(result) {
                                $scope.event={  
                                        object: result,
                                        title:null,
                                        description:null,
                                        series:null,
                                        iterations: []
                                }
                        })
                        }).then(function () {
                        $scope.$apply();
                })
        }

        getReferencedData();

        $scope.addIteration = function () {
                var Iteration = Parse.Object.extend("Iteration")
                var iteration = new Iteration().save()
                .then(function(result) {
                        $scope.event.iterations.push({
                                object:result,
                                time: null,
                                host: null,
                                location: null                                
                        })
                        $scope.$apply();                       
                })
                }

        $scope.deleteIteration = function (iteration) {

                iteration.object.destroy()
                angular.forEach($scope.event.iterations, function (value, key) { if (value==iteration) { 
                        $scope.event.iterations.splice(key,1)                                 
                }  })



        }


        $scope.saveEvent = function () {
                with ($scope.event) {                      
                        object.set('title', title)
                        object.set('description', description)
                        object.set('series', series)

                        angular.forEach($scope.event.iterations, function (iteration) {
                                iteration.object.set("event", $scope.event.object);
                                iteration.object.save();

                                object.relation("iterations").add(iteration.object);
                        })

                        object.save().then(function() {

                                //TRIGGER TIDY UP FUNCTION
                                //                        NEEDS WRITING
                                //REDIRECT
                                $state.go("tabs.schedule")
                        });
                }

        }



})        