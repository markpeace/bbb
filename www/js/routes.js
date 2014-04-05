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
    templateUrl: "pages/tabs.html"
  })
  .state('tabs.schedule', {
    url: "/schedule",
    views: {
      'schedule-tab': {
        templateUrl: "pages/schedule/list.html",
        controller: 'Schedule'          
      }
    }
  })
  .state('addEvent', {
    url: "/pages/schedule/add.html",    
    templateUrl: "pages/schedule/addEvent.html",    
    controller: "AddEvent"
  });
  
  $urlRouterProvider.otherwise("/tab/schedule");
  
})

.run(function ($rootScope, $location) {
  
  $rootScope.$on('$stateChangeStart', function (event, next, current) {
    
    if($rootScope.currentUser) {
      if(!$rootScope.currentUser.get('emailVerified') && ($rootScope.currentUser.updatedAt / 1000)<((new Date() / 1000)-43200)) {
        alert ("You need to confirm your email address before you can fully use the app - please check your mmu account");
        $rootScope.currentUser.set("email", $rootScope.currentUser.get("email"))
        $rootScope.currentUser.save()
      }
    } else {
      if(['/login','/register'].indexOf($location.url())==-1) {      
        return $location.path('/login');
      } 
    }
    
     
  });
  
})  