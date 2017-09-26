// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('bureo', ['ionic', 'ionicLazyLoad', 'ngCordova', 'bureo.controllers', 'bureo.services', 'bureo.directives', 'ionic-numberpicker', 'ionic-timepicker'])
/** LOCALHOST **/

/* 
ionic serve con --disable-web-security
ionic run android
*/
.constant('BureoApiUrl', 'http://192.168.1.55/bureo/frontend/web')

/*
ionic serve (solve CORS problems)
 */
// .constant('BureoApiUrl', '/BureoApiLocal')

/*
ionic serve 
ionic run android -l -c en Local
*/
// .constant('BureoApiUrl', '/BureoApiLocalIp')

/*
Online PC y movil live reload
*/
// .constant('BureoApiUrl', '/BureoApiOnline')

/** ONLINE **/

/*
Online movil release y no live reload
*/
// .constant('BureoApiUrl', 'http://bureo.rtawebapp.com/frontend/web/index.php')
// .constant('BureoApiUrl', 'http://localhost/bureo/frontend/web')
// .constant('BureoApiUrl', '/BureoApiLocalIp')

/* smart */
// .constant('BureoApiUrl', (function() {
//     console.log("ionic.Platform.platform()",ionic.Platform.platform(),ionic.Platform.isWebView());
//     return ionic.Platform.isWebView() ? '/BureoApiLocal' : '/BureoApiLocal';
//   }) ())
//Rutas de imagenes
.constant('PartyIcon', 'img/partylocal/party-icon.png')

.run(function($ionicPlatform, $http) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
    // org.apache.cordova.statusbar required
    StatusBar.styleDefault();
    }
  });
})

.run(function($rootScope) {
  $rootScope.bureano = {
    id: null,
    access_token:null,
    username: null,
    password: null,
    nombre: null,
    apellidos: null,
    mail: null,
    dni: null,
    avatar: null,
    descripcion:null,
    edad:null,
    facebook:null,
    google:null,
  };
  
  $rootScope.httpErrorCode = null;
  $rootScope.errorData = null;
  $rootScope.rejection = null;
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
  
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.start', {
    url: '/start',
    views: {
      'menuContent': {
        templateUrl: 'templates/start.html',
        controller: 'StartCtrl'
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('app.signup', {
    url: '/signup',
    views: {
      'menuContent': {
        templateUrl: 'templates/signup.html',
        controller: 'SignupCtrl'
      }
    }
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.localsPublish', {
    url: '/localsPublish',
    views: {
      'menuContent': {
        templateUrl: 'templates/partylocal/publishParty/localsPublish.html',
        controller: 'LocalsPublishCtrl'
      }
    }
  })  

  .state('app.publishPartylocal', {
    url: '/publishPartylocal/:localid',
    views: {
      'menuContent': {
        templateUrl: 'templates/partylocal/publishParty/publishPartylocal.html',
        controller: 'PublishPartylocalCtrl'
      }
    }
  })

  .state('app.mySolicitudes', {
    url: '/mySolicitudes',
    views: {
      'menuContent': {
        templateUrl: 'templates/partylocal/publishParty/mySolicitudes.html',
        controller: 'MySolicitudesCtrl'
      },
    }
  })


  .state('app.partylocals', {
    url: '/partylocals',
    views: {
      'menuContent': {
        templateUrl: 'templates/partylocal/partylocals/partylocals.html',
        controller: 'PartylocalsCtrl'
      }
    }
  })

  .state('app.partylocals.partylocal', {
    url: '/:id',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/partylocal/partylocals/partylocal.html',
        controller: 'PartylocalCtrl'
      },
    }
  })

  // .state('app.partylocal', {
  //   url: '/partylocal/:id',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/partylocal/partylocals/partylocal.html',
  //       controller: 'PartylocalCtrl'
  //     },
  //   }
  // })

  .state('app.myParties', {
    url: '/myParties',
    views: {
      'menuContent': {
        templateUrl: 'templates/partylocal/myParties/myParties.html',
        controller: 'MyPartiesCtrl'
      },
    }
  })

  .state('app.myParties.attendance', {
    url: '/attendance/:id',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/partylocal/myParties/attendance.html',
        controller: 'MyPartyAttendanceCtrl'
      },
    }
  })

  .state('app.tests', {
    url: '/tests',
    views: {
      'menuContent': {
        templateUrl: 'templates/tests.html',
        controller: 'TestsCtrl'
      }
    }
  })

  $urlRouterProvider.otherwise('/app/start');
  $httpProvider.interceptors.push('errorInterceptor'); 
});
