angular.module('bureo.controllers')

.controller('TestsCtrl', function($scope, $rootScope, $http, $ionicPopup, $state, $cordovaImagePicker, errorInterceptor, BureoApiUrl, serializeData, $ionicSideMenuDelegate, $ionicLoading, $cordovaFile, $cordovaFileTransfer) {
  $ionicSideMenuDelegate.canDragContent(false);

  $scope.display = "Test display";
 
  
  /**
   * Podemos usar configuracion para Auth e introducrla en cada llamada http
   * o añadir en login: $http.defaults.headers.common['Authorization'] = "Bearer 0b94e52747aed25116c735c5b59ba5c9";
   */
  // var configAuth = {
  //   headers : {
  //     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
  //     'Authorization': 'Bearer 0b94e52747aed25116c735c5b59ba5c9'
  //   }
  // }; 

  $scope.test = function() {
    $ionicLoading.show();
    console.log("login");
    var url = BureoApiUrl + '/bureanos/login';
    var data = {
      username:'bureano-app',
      password:'bureano-app',
    };

    console.log(data);

    $http.post(url, data)
      .success(function (response) {   
        $ionicLoading.hide();          
        $rootScope.bureano = response;
        // $state.go('app.home');
        console.log("avatar: ",response.avatar);
        $scope.display = $rootScope.bureano;
        // $scope.display = response;
        $http.defaults.headers.common['Bureano-Authorization'] = "Bearer "+$rootScope.bureano.access_token;
      })
      .error(function(error) {
        $ionicLoading.hide();
        console.error("error en Login");   
      }); 
  };  

  $scope.test2 = function() {
    $ionicLoading.show();
    console.log("test");
    // var url = BureoApiUrl + "/bureanos/test";
    var url = BureoApiUrl + '/bureanos/test';
    console.log("url: ",url);

    $http.get(url)
      .success(function (response) {   
        $ionicLoading.hide();          
        $rootScope.bureano = [];
        console.log(response);
      })
      .error(function(error) {
        $ionicLoading.hide();
        console.error("error en Test");   
      });  
  };  

  $scope.Signup = function() {
    $ionicLoading.show();
    var url = BureoApiUrl + '/bureanos/signup';

    var newUser = {
      nombre:'test',
      username:'test',
      password:'test',
      dni:'test',
      apellidos:'test',
      edad:20,
      descripcion:'test',
      mail:'test',
      facebook:'test',
      google:'test',
    };

    console.log("url ",url);
    
    $http.post(url, newUser)
    .success(function (response) {
      $ionicLoading.hide();
      console.log("response:",response);
    })
    .error(function(error) 
    {
      $ionicLoading.hide();
      console.error("error en Signup");     
    });
  };   

  $scope.Login = function() {
    $ionicLoading.show();
    console.log("login");
    var url = BureoApiUrl + '/bureanos/login';
    var data = {
      username:'bureano',
      password:'bureano123',
    };

    console.log(data);

    $http.post(url, data)
      .success(function (response) {   
        $ionicLoading.hide();          
        $rootScope.bureano = response;
        console.log(response);
        $scope.display = $rootScope.bureano;
    		$http.defaults.headers.common['Bureo-Authorization'] = "Bearer "+$rootScope.bureano.access_token;
      })
      .error(function(error) {
        $ionicLoading.hide();
        console.error("error en Login");   
      });  

    //el login que funciona
    // $ionicLoading.show();
    // var url = BureoApiUrl + '/bureanos/login';
    // var data = {
    //   username:$scope.userLogin.username,
    //   password:$scope.userLogin.password,
    // };

    // $http.post(url, data)
    //   .success(function (response) {   
    //     $ionicLoading.hide();          
    //     $rootScope.bureano = response;
    //     console.log(response);
    //     $scope.display = $rootScope.bureano;
    //     $http.defaults.headers.common['Authorization'] = "Bearer "+$rootScope.bureano.access_token;
    //     $state.go('app.home');
    //   })
    //   .error(function(error) {
    //     $ionicLoading.hide();
    //     if($rootScope.httpErrorCode == -1)
    //       var alertPopup = $ionicPopup.alert({
    //         title: 'Error '+$rootScope.httpErrorCode,
    //         template: 'Error de conexion<br>url: <a href="'+url+'">'+url+'</a>'
    //       });
    //     if($rootScope.httpErrorCode == 3)
    //       var alertPopup = $ionicPopup.alert({
    //         title: 'Error '+$rootScope.httpErrorCode,
    //         template: 'Usuario o Contraseña incorrectos'
    //       });
    //     if($rootScope.httpErrorCode == 404)
    //       var alertPopup = $ionicPopup.alert({
    //         title: 'Error '+$rootScope.httpErrorCode,
    //         template: 'Usuario o Contraseña incorrectos'
    //       });
    //   });         
  }; 

  $scope.Logout = function() {
    $ionicLoading.show();
    console.log("Logout");
    var url = BureoApiUrl + '/bureanos/logout';

    var data = {
      username:'bureano4',
      password:'bureano123',
    };

    console.log(data);

    $http.post(url, data)
      .success(function (response) {   
        $ionicLoading.hide();          
        $rootScope.bureano = [];
        console.log(response);
        $scope.display = $rootScope.bureano;
        $scope.display = response;
      })
      .error(function(error) {
        $ionicLoading.hide();
        console.error("error en Logout");  
        $http.defaults.headers.common['Bureano-Authorization'] = ""; 
      });        
  }; 

  $scope.Update = function() {
    $ionicLoading.show();

    var url = BureoApiUrl + '/bureanos/'+$rootScope.bureano.id;

    var updateBureano = {
      nombre:'bureano-app',
      apellidos:'bureano-app',
      dni:'bureano-app',
      edad:99,
      descripcion:'bureano-app',
      facebook:'bureano-app',
      google:'bureano-app',
    };

    console.log("url ",url);
    
    $http.put(url, updateBureano)
    .success(function (response) {
      $ionicLoading.hide();
      console.log("response:",response);
      console.log("antes:",$rootScope.bureano);
      angular.merge($rootScope.bureano, response); 
      console.log("despues:",$rootScope.bureano);
    })
    .error(function(error) 
    {
      $ionicLoading.hide();
      console.error("error en Update");     
    });
  }; 

  $scope.Whoami = function() {
    $ionicLoading.show();
    // var url = 'http://localhost/bureo3/frontend/web/usuarios/test';
    var url = BureoApiUrl + '/bureanos/whoami';
    
    $http.get(url)
    .success(function (response) {
      $ionicLoading.hide();
      console.log("response:",response);
    })
    .error(function(error) 
    {
      $ionicLoading.hide();
      console.error("error en Whoami");     
    });
  };  
})
;