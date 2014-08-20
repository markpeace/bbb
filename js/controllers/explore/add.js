bbb.controller('AddLocation', function($scope, $state, $stateParams, ParseService) { 

        $stateParams.location={}

        if($stateParams.id) {
                console.log("NEED A MECHANISM TO RETRIEVE EXISTING ")
        } 

        $scope.saveLocation = function() {
                if($stateParams.id) {
                        console.log("NEED A MECHANISM TO SAVE EXISTING")
                } else {


                        (new (Parse.Object.extend("Location")))
                        .save($stateParams.location).then(function() {
                                $state.go("tabs.explore")
                        })                        
                }
        }
});