bbb.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
  
  .state('login', {
    url: "/login",    
    templateUrl: "pages/user/login.html", 
    controller: "Login" 
  })
  .state('register', {
    url: "/register",    
    templateUrl: "pages/user/register.html",    
    controller: "Register"
  })
  
  .state('tabs', {
    url: "/tab",
    abstract: true,
    controller: 'Tab',
    templateUrl: "pages/tabs/tabs.html"
  })
  .state('tabs.schedule', {
    url: "/schedule",
    views: {
      'schedule-tab': {
        templateUrl: "pages/tabs/schedule.html",
        controller: 'Schedule'          
      }
    }
  });
  
  $urlRouterProvider.otherwise("/tab/schedule");
  
})

.run(function ($rootScope, $location) {
  
  $rootScope.$on('$stateChangeStart', function (event, next, current) {
    if(['/login','/register'].indexOf($location.url())==-1 && !$rootScope.currentUser) {      
      return $location.path('/login');
    } else {
      
      if(($rootScope.currentUser.updatedAt / 1000)<((new Date() / 1000)-43200)) {
        alert ("You need to confirm your email address before you can fully use the app - please check your mmu account");
        $rootScope.currentUser.set("email", $rootScope.currentUser.get("email"))
        $rootScope.currentUser.save()
      }
      
    }
  });
  
})  