angular.module('bureo.controllers')

.controller('SignupCtrl', function($scope, $rootScope, $http, $ionicPopup, $state, $cordovaImagePicker, errorInterceptor, serializeData, $ionicSideMenuDelegate, $ionicLoading, $cordovaFile, $cordovaFileTransfer, BureoApiUrl) {
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
    // avatar : null,
  };

  $scope.signup = function() {
    $ionicLoading.show();
    var url = BureoApiUrl + '/bureanos/signup';
    console.log('$scope.newUser',$scope.newUser);
    var newUser = $scope.newUser;
    console.log('newUser',newUser);
    
    $http.post(url, newUser)
    .success(function (response) {
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: "Bureano creado",
        template: 'Ya puedes loguearte con tu nuevo Usuario de Bureo'
      });
      $state.go('app.login');
    })
    .error(function(error) 
    {
      $ionicLoading.hide();
      console.error("error en Signup");     
    });
  }; 

  /**
   * Funcion para seleccionar la imagen de la galería interna
   */
  // $scope.saveImage = function() {   
  //   var options = {
  //     maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
  //     width: 800,
  //     height: 800,
  //     quality: 80            // Higher is better
  //   };

  //   $cordovaImagePicker.getPictures(options)    
  //   .then(function (results) {
  //     for (var i = 0; i < results.length; i++) {
  //       $scope.newUser.avatar = results[i];
  //       console.log('Imagen selecionada: ' + $scope.newUser.avatar);
  //     }
  //   }, function(error) {
  //     // error getting photos
  //     console.error("error en fotos");
  //   });
  // };  

  // $scope.createUser = function() {
  //   $ionicLoading.show();
  //   // Image picker will load images according to these settings
  //   var options = {
  //     maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
  //     width: 800,
  //     height: 800,
  //     quality: 80            // Higher is better
  //   };

  //   console.log("username:  ",$scope.newUser.username);

  //   var link = BureoApiUrl+'/usuarios/search?username='+$scope.newUser.username;
  //   var link = BureoApiUrl+'/bureanos/signup';
  //   console.log("link ",link);
  //   // var link = 'http://localhost/bureo/frontend/web/index.php/fiestas';
  //   var user_check;

  //   $http.get(link)
  //   .success(function (response) {
  //     $ionicLoading.hide();
  //     console.log("usuario encontrado");
  //     console.log("usuario:",response.data);
  //     user_check = response.data;
  //     var alertPopup = $ionicPopup.alert({
  //       title: 'Error',
  //       template: 'Usuario existente. Elige otro nombre'
  //     });
  //   })
  //   .error(function(error) 
  //   {
  //     console.log("usuario no encontrado");     
  //     var link = BureoApiUrl+'/usuarios';            
  //     var newUserCreate = serializeData.serialize($scope.newUser);
    
  //     var config = {
  //       headers : {
  //         'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
  //       }
  //     }

  //     console.log("vamos a enviar:",newUserCreate);
  //     $http.post(link ,newUserCreate, config)
  //       .success(function (data, status, headers, config) {
  //         console.log("usuario creado, response: ",data);                    
  //         $rootScope.user = data;   
  //         if($scope.newUser.avatar != "/img/profile.png"){
  //           uploadImage($rootScope.user.id);
  //         }
  //         else{
  //           $ionicLoading.hide();
  //           $state.go('app.home');
  //         }
  //       })
  //       .error(function (data, status, header, config) {
  //         $ionicLoading.hide();
  //         $scope.ResponseDetails = "Data: " + data +
  //           "<hr />status: " + status +
  //           "<hr />headers: " + header +
  //           "<hr />config: " + config;
  //         console.log(data);
  //       }); 
  //   });
  // };    

  // function uploadImage(userID) { 
  //   console.log("uploadImage to user "+userID);
  //   // Destination URL 
     
  //   //File for Upload
  //   var targetPath = $scope.newUser.avatar;

  //   var options = {
  //     fileKey: "file",
  //     fileName: "file",
  //     chunkedMode: false,
  //     mimeType: "multipart/form-data",
  //     // mimeType: "image/jpg",
  //   };
  //   var extension = targetPath.substring(targetPath.lastIndexOf('.') + 1).toLowerCase();
  //   var url = BureoApiUrl + '/usuarios/imagen/' + userID + '/extension/'+extension;
    
  //   console.log("Vamos a enviar:");
  //   console.log("url:",url);
  //   console.log("targetPath:",targetPath);
  //   console.log("options:",options);

  //   $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
  //     $ionicLoading.hide();
  //     console.log("SUCCESS: " + JSON.stringify(result.response));
  //     console.log(result.response);
  //     $rootScope.user.avatar = BureoApiUrl2+JSON.parse(result.response);
  //     console.log("$rootScope.user ", $rootScope.user);
  //     $state.go('app.home');
  //   }, function (err) {
  //     console.log("ERROR: " + JSON.stringify(err));
  //     $ionicLoading.hide();
  //   }, function (progress) {
  //     console.log("Progress");
  //   });
  // };  
})
;