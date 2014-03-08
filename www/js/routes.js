bbb.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "pages/tabs.html"
    })
    .state('tabs.schedule', {
      url: "/schedule",
      views: {
        'schedule-tab': {
          templateUrl: "pages/schedule.html",
          controller: 'Schedule'          
        }
      }
    });


   $urlRouterProvider.otherwise("/tab/schedule");

})