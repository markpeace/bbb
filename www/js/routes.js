bbb.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
  
  .state('splash', {
    url: "/splash",    
    templateUrl: "pages/user/splash.html"          
  })
  
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
    
  $urlRouterProvider.otherwise("/splash");
  
})