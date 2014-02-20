xyxxy.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "pages/tabs.html"
  })
   .state('tab.social', {
    url: '/social',
    views: {
      'social-tab': {
        templateUrl: 'pages/social.html',
        controller: 'Schedule'
      }
    }
  })
  
  .state('tab.schedule', {
    url: '/schedule',
    views: {
      'schedule-tab': {
        templateUrl: 'pages/schedule.html',
        controller: 'Schedule'
      }
    }
  })
  
  .state('tab.badgea', {
    url: '/badges',
    views: {
      'badges-tab': {
        templateUrl: 'pages/badges.html',
        controller: 'Schedule'
      }
    }
  })
  
  .state('tab.leaderboard', {
    url: '/leaderboard',
    views: {
      'leaderboard-tab': {
        templateUrl: 'pages/leaderboard.html',
        controller: 'Schedule'
      }
    }
  });
    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/schedule');
})