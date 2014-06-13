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

        //                TABS ROUTES

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
                                controller: 'ListEvents'          
                        }
                }
        })
        .state('tabs.schedule_booked', {
                url: "/schedule/booked",
                views: {
                        'schedule-tab': {
                                templateUrl: "pages/schedule/list.html",
                                controller: 'ListEvents'          
                        }
                }
        })
        .state('viewEvent', {
                url: "/schedule/view/{id}",    
                templateUrl: "pages/schedule/viewEvent.html",    
                controller: "ViewEvent"
        })

        .state('eventQRCode', {
                url: "/schedule/code/{id}",    
                templateUrl: "pages/schedule/QRCode.html",    
                controller: "EventQRCode"
        })

        .state('eventRegister', {
                url: "/schedule/register/{id}",    
                templateUrl: "pages/schedule/register.html",    
                controller: "AttendenceRegister"
        })

        .state('addEvent', {
                url: "/schedule/add/",    
                templateUrl: "pages/schedule/addEvent.html",    
                controller: "AddEvent"
        })

        .state('editEvent', {
                url: "/schedule/add/{id}",    
                templateUrl: "pages/schedule/addEvent.html",    
                controller: "AddEvent"
        })

        .state('tabs.hunt', {
                url: "/hunt",
                views: {
                        'hunt-tab': {
                                templateUrl: "pages/hunt/listHuntItems.html",
                                controller: 'ListHuntItems'          
                        }
                }})

        .state('tabs.badges', {
                url: "/badges",
                views: {
                        'badges-tab': {
                                templateUrl: "pages/badges/listBadges.html",
                                controller: 'ListBadges'          
                        }
                }})


        .state('settings', {
                url: "/settings",
                controller: 'Settings',
                templateUrl: "pages/settings.html"
        })

        .state('isOffline', {
                url: "/isOffline",
                templateUrl: "pages/offlineMessage.html"
        })

        // CHECK-IN ROUTE

        .state('checkin', {
                url: "/checkIn",
                controller: 'CheckIn',
                templateUrl: "pages/checkin/checkin.html"
        })

        $urlRouterProvider.otherwise("/tab/schedule");

})

.run(function ($rootScope, ParseService, $location, $state) {

        if(typeof cordova === 'object') {

                document.addEventListener("offline", function () {
                        console.log("gone offline")
                        var previousState = $state.current.name
                        $state.go("isOffline")

                        document.addEventListener("online", function () {
                                $state.go(previousState)
                        })

                }, false);
        }





        if (Parse.User.current()) { Parse.User.current().fetch();  }

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