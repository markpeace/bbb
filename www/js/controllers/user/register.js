bbb.controller('Register', function($scope, $ionicModal, ParseService) { 
  
  $scope.programmes=[];
  
  $scope.programmeLabel="Programme";
  
  $scope.newUser = {
    username: '',
    password: '',
    confirm_password: '',
    programme: ''    
  }
  
  var Programmes = Parse.Object.extend("Programmes");
  var query = new Parse.Query(Programmes);
  query.ascending("label");
  query.find({
    success: function(results) {
      $scope.programmes=results;      
    }
  });
  
  $ionicModal.fromTemplateUrl('pages/user/register_programmelist.html', function($ionicModal) {
    $scope.modal = $ionicModal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });  
  
  
  $scope.$watch('newUser.programme',function(){
    if ($scope.newUser.programme) { $scope.programmeLabel = $scope.newUser.programme.get('label') } 
  })  
  
});