// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $ionicConfigProvider.navBar.alignTitle('left');
  $ionicConfigProvider.tabs.position('bottom');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('app', {
    url: '/',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('app.dash', {
    url: 'app/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('app.search_text', {
    url: 'app/search_text',
    views: {
      'tab-dash': {
        templateUrl: 'templates/search_text.html',
        controller: 'SearchTextCtrl'
      }
    }
  })
  .state('app.search_image/:image', {
    url: 'app/search_image/:image',
    views: {
      'tab-dash': {
        templateUrl: 'templates/search_image.html',
        controller: 'SearchImageCtrl'
      }
    }
  })
  .state('app.search_result_text/:q', {
    url: 'app/search_result_text/:q',
    views: {
      'tab-dash': {
        templateUrl: 'templates/search_result_text.html',
        controller: 'SearchResultTextCtrl'
      }
    }
  })
  .state('app.search_result_text_discover/:q', {
    url: 'app/search_result_text_discover/:q',
    views: {
      'tab-discover': {
        templateUrl: 'templates/search_result_text.html',
        controller: 'SearchResultTextCtrl'
      }
    }
  })
  .state('app.search_result_text_profile/:q', {
    url: 'app/search_result_text_profile/:q',
    views: {
      'tab-account': {
        templateUrl: 'templates/search_result_text.html',
        controller: 'SearchResultTextCtrl'
      }
    }
  })
  .state('app.discover', {
      url: 'app/discover',
      views: {
        'tab-discover': {
          templateUrl: 'templates/tab-discover.html',
          controller: 'DiscoverCtrl'
        }
      }
    })

  .state('app.account', {
    url: 'app/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise( function($injector, $location) {
      var $state = $injector.get("$state");
      $state.go("app.dash");
    });

});
