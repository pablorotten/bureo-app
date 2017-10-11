angular.module('bureo.controllers')
.controller('HomeCtrl', function($scope, $rootScope, $http, $timeout, $ionicPlatform, serializeData, $ionicSideMenuDelegate, $ionicLoading, autoLogin, BureoApiUrl) {
  $ionicPlatform.registerBackButtonAction(function () {
  }, 100);
  $ionicSideMenuDelegate.canDragContent(true);

  /**
   * Autologin de prueba
   */
  if($rootScope.bureano.id == null){
    autoLogin.login();
  }

  console.debug("Welcome Bureano to the app: ",$rootScope.bureano);
  $scope.sliderImages = [{id: 1, src: "img/home_slider/1.jpg"},{id: 2, src: "img/home_slider/2.jpg"},{id: 3, src: "img/home_slider/3.jpg"},{id: 4, src: "img/home_slider/4.jpg"}];
  
  var frases = new Array(
    "Diviértete con responsabilidad",
    "Elige tu diversión",
    "Diseña tu noche"
  );

  $scope.frase = frases[Math.floor(Math.random() * frases.length)];
});