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

                        $scope.$apply();


                }, function (result) {
                        var GameScore = Parse.Object.extend("Event");
                        var gameScore = new GameScore().save()
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


        $scope.saveEvent = function () {
                with ($scope.event) {                      
                        object.set('title', title)
                        object.set('description', description)
                        object.set('series', series)
                        object.save().then(function() {
                                $state.go("tabs.schedule")
                        });
                }
                        
        }
        
        

})        