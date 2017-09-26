angular.module('bureo.controllers')
.controller('LoginCtrl', function($rootScope, $scope, $timeout, $stateParams, $ionicHistory, $http, $ionicPopup, $state, serializeData, $ionicSideMenuDelegate, $ionicLoading, BureoApiUrl) {
  $ionicSideMenuDelegate.canDragContent(false);

  $scope.userLogin = {
    username : null,
    password : null
  };

  $scope.login = function() {
    $ionicLoading.show();
    var url = BureoApiUrl + '/bureanos/login';
    var data = {
      username:$scope.userLogin.username,
      password:$scope.userLogin.password,
    };

    $http.post(url, data)
      .success(function (response) {   
        $ionicLoading.hide();          
        $rootScope.bureano = response;
        console.log(response);
        $http.defaults.headers.common['Bureo-Authorization'] = "Bearer "+$rootScope.bureano.access_token;
        $state.go('app.home');
      })
      .error(function(error) {
        $ionicLoading.hide();
        if($rootScope.httpErrorCode == -1)
          var alertPopup = $ionicPopup.alert({
            title: 'Error '+$rootScope.httpErrorCode,
            template: 'Error de conexion<br>url: <a href="'+url+'">'+url+'</a>'
          });
        if($rootScope.httpErrorCode == 3)
          var alertPopup = $ionicPopup.alert({
            title: 'Error '+$rootScope.httpErrorCode,
            template: 'Usuario o Contraseña incorrectos'
          });
        if($rootScope.httpErrorCode == 404)
          var alertPopup = $ionicPopup.alert({
            title: 'Error '+$rootScope.httpErrorCode,
            template: 'Usuario o Contraseña incorrectos'
          });
      });        
  }; 
})
;