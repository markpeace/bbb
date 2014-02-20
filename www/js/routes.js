xyxxy.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
  .state('schedule', {
    url: "/schedule",
    templateUrl: "pages/schedule.html",
    controller: 'Schedule'
  })
 
  // if none of the above are matched, go to this one
  $urlRouterProvider.otherwise("/schedule");
})