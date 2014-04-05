bbb.controller('Schedule', function($scope, ParseService, $rootScope) { 
  
  $scope.securityLevel=$rootScope.currentUser.get('securityLevel');
  
  var Event = Parse.Object.extend("Events");
  var query = new Parse.Query(Event);
  query.ascending("time");
  query.find({
    success: function(results) {
      
      function formatDate(d) {
        dt= new Date(d);
        return dt.getDate().toString() + "-" + dt.getMonth().toString() + "-"  + dt.getFullYear().toString()
      }
      
      $scope.events=results;
      $scope.dates=[];
      t=""
      for (r in results) {
        if (formatDate(results[r].get("time"))!=t) { $scope.dates.push(results[r].get("time")) }
        t=formatDate(results[r].get("time"))
      }
      
      $scope.selectedDate=0;
      $scope.$apply();
    }
  });
  
  $scope.changeDate=function(increment) {
    $scope.selectedDate=$scope.selectedDate+increment;
  }
  
});


bbb.controller('AddEvent', function($scope, $ionicModal,  $state, $ionicLoading, ParseService) { 
  
  $scope.tutorLabel = "Host"
  $scope.locationLabel = "Location"
  
  
  $scope.newEvent = {
    title:null,
    time:new Date(),
    description: null,
    location:null,
    host:null
  }
  
  
  var User = Parse.Object.extend("User");
  var query = new Parse.Query(User);
  query.lessThan("securityLevel",3);
  query.ascending("surname");
  query.find({
    success:function(result) {
      $scope.tutors=result
    }
  })
  
  var Locations= Parse.Object.extend("locations");
  var locquery = new Parse.Query(Locations);
  
  locquery.find({
    success:function(result) {
      $scope.locations=result
    }
  })
  
  $ionicModal.fromTemplateUrl('pages/schedule/addEvent_tutorlist.html', function($ionicModal) {
    $scope.tutorlistModal = $ionicModal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });  
  
  $ionicModal.fromTemplateUrl('pages/schedule/addEvent_location.html', function($ionicModal) {
    $scope.locationModal = $ionicModal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  
  $scope.$watch('newEvent.host',function(){      
    if ($scope.newEvent.host) { $scope.tutorLabel = $scope.newEvent.host.get('forename') + " " + $scope.newEvent.host.get('surname')} 
  })  
  $scope.$watch('newEvent.location',function(){      
    if ($scope.newEvent.location) { $scope.locationLabel = $scope.newEvent.location.get('label') } 
  })   
  
  $scope.saveEvent = function () {
    
    $scope.saving = $ionicLoading.show({
      content: 'Saving',
    });
    
    var event = new (Parse.Object.extend("Event")); 
    event.save($scope.newEvent, {
      success: function() {
        $scope.saving.hide();
        $state.go("tabs.schedule");
      },
      error: function(event, error) {
        $scope.saving.hide();
        alert("Error: " + error.message);
      }
      
    })

  }
  
})