// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

'use strict';
angular.module('starter', ['ionic','ngRoute', 'starter.controllers', 'starter.services'])
.config(function($ionicConfigProvider){
    $ionicConfigProvider.tabs.position('bottom');
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
	            
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
  
    .state('login', {
      url: '/login', 
	
               templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
	
  }) 
      .state('register', {
        url: '/registro',
        templateUrl: 'templates/signup.html',
		controller: 'RegistroCtrl'
		
    })
	.state('about', {
        url: '/acerca',
        templateUrl: 'templates/simple.html',
		controller: 'SimpleCtrl'
		
    })
	.state('terms', {
        url: '/terminos-y-condiciones',
        templateUrl: 'templates/simple1.html',
		controller: 'SimpleCtrl'
		
    })
	.state('privacidad', {
        url: '/politica-de-privacidad',
        templateUrl: 'templates/simple2.html',
		controller: 'SimpleCtrl'
		
    })
	/*
  
    .state('forgotpassword', {
      url: '/forgot-password',
      templateUrl: 'templates/forgot-password.html'
    })*/
    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html",
		controller: 'LoginCtrl',
		onEnter: function($state, Auth){
        if(!Auth.isLoggedIn()){
           $state.go('login');
        }
    }
    })
  
    // Each tab has its own nav history stack:

    /*.state('tab.feeds', {
        url: '/feeds',
        views: {
            'tab-feeds': {
                templateUrl: 'templates/tab-feeds.html',
                controller: 'FeedsCtrl'
            }
        }
    })*/
	  .state('tab.configfeeds', {
        url: '/config-feeds',
        views: {
            'tab-feeds': {
                templateUrl: 'templates/tab-config-feeds.html',
                controller: 'ConfigfeedCtrl'
            }
        }
    })
    .state('tab.feeds', {
        url: '/feeds',
        views: {
            'tab-feeds': {
                templateUrl: 'templates/tab-feeds.html',
                controller: 'FeedsCtrl'
            }
        }
    })
        
    .state('tab.tema_feeds', {
        url: '/myfeeds',
        views: {
            'tab-myfeeds': {
                templateUrl: 'templates/misfeeds-2.html',
                controller: 'MyfeedsCtrl'
            }
        }
    })
	.state('tab.myfeeds', {
        url: '/myfeeds/feeds',
        views: {
            'tab-myfeeds': {
                templateUrl: 'templates/tab-myfeeds.html',
                controller: 'MyfeedsCtrl'
            }
        }
    })
    
    .state('tab.following', {
        url: '/following',
        views: {
            'tab-following': {
                templateUrl: 'templates/tab-following.html',
                controller: 'FollowingCtrl'
            }
        }
    })
        
    .state('tab.groups', {
        url: '/groups',
        views: {
            'tab-groups': {
                templateUrl: 'templates/tab-groups.html',
                controller: 'GroupsCtrl'
            }
        }
    })
    
    .state('tab.favorites', {
        url: '/favorites',
        views: {
            'tab-favorites': {
                templateUrl: 'templates/tab-favorites_back.html',
                controller: 'FavoritesCtrl'
            }
        }
    })
    
    .state('tab.feed', {
      url: '/favorites/feed',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-favorites-feed.html',
          controller: 'FeedFavoritesCtrl'
        }
      }
    })
     .state('profile', {
            url: '/profile',
		 /*views: {
				'tab-profile': {
			*/	templateUrl: 'templates/tab-perfil.html',
				controller: 'PerfilCtrl'
			/*	}
			}*/
        });
    

    
    /*.state('tab.feed', {
        url: '/favorites/feed',
        views: {
            'tab-usuarios': {
                templateUrl: 'templates/tab-feeds.html',
                controller: 'FeedCtrl'
            }
        }
    });*/

    // if none of the above states are matched, use this as the fallback
    //if(window.localStorage.getItem('user')==false)
		$urlRouterProvider.otherwise('/login');
	
    // setup an abstract state for the tabs directive
    
  
});
/*
var example = angular.module("starter", ['ui.router']);
example.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('settings', {
            url: '/settings'
        })
        .state('settings.profile', {
            url: '/profile',
            templateUrl: 'templates/perfil.html',
            controller: 'ProfileCtrl'
        })
        .state('settings.account', {
            url: '/account',
            templateUrl: 'templates/account.html',
            controller: 'AccountCtrl'
        });
    $urlRouterProvider.otherwise('/settings/profile');
});


/*
var express = require('express')
var app = express()

app.get('/api/login', function(req, res) {
  res.json({name: 'login'})
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});*/
