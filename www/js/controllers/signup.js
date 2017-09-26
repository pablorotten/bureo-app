angular.module('bureo.controllers')

.controller('SignupCtrl', function($scope, $rootScope, $http, $state, $cordovaImagePicker, serializeData, $ionicSideMenuDelegate, $ionicLoading, $cordovaFile, $cordovaFileTransfer, BureoApiUrl) {
  $ionicSideMenuDelegate.canDragContent(false); 
   
  $scope.newUser = {
    nombre : null,
    apellidos : null,
    descripcion : null,
    dni : null,
    username : null,
    mail : null,
    password : null,
    edad : null,
    avatar : null,
  };
  
  // $scope.newUser = {
  //   nombre : "A",
  //   apellidos : "A",
  //   descripcion : "A",
  //   dni : "A",
  //   username : "A",
  //   mail : "A",
  //   password : "a",
  //   edad : 18,
  //   avatar : null,
  //   access_token : null
  // };

  $scope.selectedImage = {
    path : null,
    type : null,
  }

  $scope.signup = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> <br/> Creando cuenta...'
    });
    var url = BureoApiUrl + '/bureanos/signup';
    console.log('$scope.newUser',$scope.newUser);
    var newUser = $scope.newUser;
    console.log('newUser',newUser);
    
    $http.post(url, newUser)
    .success(function (response) {
      $scope.newUser.access_token = response.access_token;
      $scope.newUser.id = response.id;
      uploadImage();
    })
    .error(function(error) 
    {
      console.error(error);
      $ionicLoading.hide();   
    });
  }; 

  /**
   * Funcion para seleccionar la imagen de la galería interna
   */
  $scope.saveImage = function() {   
    var options = {
      maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
      width: 800,
      height: 800,
      quality: 80            // Higher is better
    };

    $cordovaImagePicker.getPictures(options)    
    .then(function (results) {
      for (var i = 0; i < results.length; i++) {
        $scope.selectedImage.path = results[i];
        // console.log('Imagen selecionada: ' + $scope.selectedImage.path);
        $scope.selectedImage.type = $scope.selectedImage.path.substring($scope.selectedImage.path.lastIndexOf('.') + 1).toLowerCase();
        // console.log('Imagen type: ' + $scope.selectedImage.type);
      }
    }, function(error) {
      // error getting photos
      console.error("error en fotos");
    });
  };    

  function uploadImage(){
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> <br/> Subiendo imágen...'
    });
    // console.log("uploadImage to user "+$scope.newUser.id);
    // Destination URL 
     
    //File for Upload
    var filePath = $scope.selectedImage.path;
    /*
    - mimeType: establecemos la codificación obtenida a partir de la extensión del archivo seleccionado
    - headers: establecemos el token de autenticación (En signup nos logueamos)
     */
    var options = {
      fileKey: "avatar",
      fileName: "avatar",
      chunkedMode: false,
      // mimeType: "multipart/form-data",
      mimeType: $scope.selectedImage.type,
      headers: {'Bureo-Authorization' : "Bearer "+$scope.newUser.access_token}
    };

    var url = BureoApiUrl + '/bureanos/' + $scope.newUser.id + '/avatar';

    $cordovaFileTransfer.upload(url, filePath, options).then(function (result) {
      // $ionicLoading.hide();
      console.log("result:",result);
      login();
    }, function (error) {
      console.error("ERROR: " + JSON.stringify(err));
      $ionicLoading.hide();
    }, function (progress) {
      console.log("Progress");
    });
  };

  function login() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> <br/> Entrando en la app...'
    });
    var url = BureoApiUrl + '/bureanos/login';
    var data = {
      username:$scope.newUser.username,
      password:$scope.newUser.password,
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
      });        
  }; 
  $scope.test = function (){
    console.log("test");
    uploadImage();
  }
})
;