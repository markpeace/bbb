bbb.controller('AddEvent', function($scope, $state,  $stateParams,  $ionicModal, ParseService) { 


        var getReferencedData = function () {                                                        // GET DATA FROM OTHER TABLES AS NEEDED
                $scope.relatedData=[]
                $scope.moment = moment;


                startDate=moment("10:00 22/09/14", "HH:mm DD/MM/YY")
                numberOfDays=5
                numberOfTimeSlots=19
                lengthOfTimeSlots=20

                $scope.relatedData['Dates'] = []                
                $scope.relatedData['Dates'][0] = startDate.format('DD/MM/YY')
                for (d=1;d<numberOfDays;d++) $scope.relatedData['Dates'][d]=moment($scope.relatedData['Dates'][d-1],'DD/MM/YY').add('days',1).format('DD/MM/YY')

                $scope.relatedData['Times'] = []                
                $scope.relatedData['Times'][0] = startDate.format('HH:mm')                
                for (d=1;d<numberOfTimeSlots;d++) $scope.relatedData['Times'][d]=moment($scope.relatedData['Times'][d-1],'HH:mm').add('minutes',lengthOfTimeSlots).format('HH:mm')

                queryData = [
                        { tableName: 'Series' },
                        { tableName: 'Location' },
                        { tableName: 'User', query: "lessThan('securityLevel', 3)"}
                ]      


                angular.forEach(queryData, function(q,i) {

                        query = new Parse.Query(Parse.Object.extend(q.tableName))
                        if (q.query) { query=eval("query."+q.query) }
                        query.find().then(function(result) {
                                $scope.relatedData[q.tableName]=result                                                              
                        }).then(function () {
                                $scope.$apply()
                                if (i==queryData.length-1) { getFocalRecord() }                                                                
                        })                                               

                })

        }

        var getFocalRecord = function () {                                                           // EITHER RETRIEVES OR CREATES A RECORD
                
                if ($stateParams.id) {
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
                                .equalTo("event", result).include("host").include("location")
                                .find().then(function(iterations) {
                                        angular.forEach(iterations, function(iteration) {
                                                $scope.event.iterations.push(iteration)
                                        })
                                        $scope.$apply();       
                                })                                           


                        })
                } else {
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

                                $scope.$apply();
                        })
                        }



        }

        getReferencedData();

        $scope.addIteration = function () {
                var Iteration = Parse.Object.extend("Iteration")
                var iteration = new Iteration().set("event", $scope.event.object).save()
                .then(function(result) {
                        $scope.event.iterations.push(result)
                        $scope.event.object.relation("iterations").add(result);
                        $scope.event.object.save();
                        $scope.$apply();             
                })        
                }

        $scope.deleteIteration = function (iteration) {

                iteration.destroy()
                angular.forEach($scope.event.iterations, function (value, key) { if (value==iteration) { 
                        $scope.event.iterations.splice(key,1)                                 
                }  })



        }


        $ionicModal.fromTemplateUrl('pages/schedule/editIteration.html', function($ionicModal) {
                $scope.editIterationModal = $ionicModal;
        }, {
                scope: $scope,
                animation: 'slide-in-up'
        });   

        $scope.editIteration = function(iteration) {

                loc =""
                host = ""
                date = ""
                time = ""

                if (iteration.get('location')) { angular.forEach($scope.relatedData['Location'], function (value) { if (value.id==iteration.get('location').id) { loc=value }  })}
                if (iteration.get('host')) { angular.forEach($scope.relatedData['User'], function (value) { if (value.id==iteration.get('host').id) { host=value }  })}

                $scope.focalIteration = {
                        object: iteration,
                        host: host,
                        location: loc,
                        date: moment(iteration.get('time')).format("DD/MM/YY"),
                        time: moment(iteration.get('time')).format("HH:mm"),
                        capacity: iteration.get('capacity')
                }                        

                $scope.editIterationModal.show();
        }

        $scope.saveEditedIteration = function() {

                $scope.focalIteration.object.set('host', $scope.focalIteration.host)
                $scope.focalIteration.object.set('location', $scope.focalIteration.location)
                $scope.focalIteration.object.set('time', moment($scope.focalIteration.time+ " " +$scope.focalIteration.date, "HH:mm DD/MM/YY")._d)                
                $scope.focalIteration.object.set('capacity', $scope.focalIteration.capacity)                

                $scope.focalIteration.object.save().then(function () {
                        $scope.editIterationModal.hide();
                })

        }


        $scope.saveEvent = function () {

                if($scope.event.iterations.length==0) {
                        if (confirm("Events cannot exist without at least one iteration, delete this event?")) {

                                $scope.event.object.destroy({ success :function(E) {
                                        $state.go("tabs.schedule")
                                }})
                        }

                } else {


                        with ($scope.event) {                      
                                object.set('title', title)
                                object.set('description', description)
                                object.set('series', series)

                                angular.forEach($scope.event.iterations, function (iteration) {
                                        iteration.set("event", $scope.event.object);
                                        iteration.save();

                                        object.relation("iterations").add(iteration);
                                })

                                object.save().then(function() {
                                        $state.go("tabs.schedule")
                                });
                        }

                }

        }



})        