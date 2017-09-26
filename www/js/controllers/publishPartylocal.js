'use strict';
angular.module('bureo.controllers')
.controller('LocalsPublishCtrl', function($scope, $rootScope, $http, $stateParams, $state, $timeout, $ionicLoading, $ionicModal, BureoApiUrl, mapService) {
  // console.log("IndexPartylocalsCtrl");

  $scope.locals = {};
  $scope.local = {};

  $http.get(BureoApiUrl + '/locals').then(function (response) {
    $ionicLoading.show();
    $scope.resultados = response.data.length;
    $scope.locals = response.data;
    $ionicLoading.hide();

    //Dividimos los resultados por Localicación (ciudades)
    var indexedCiudades = [];
    $scope.localsPerCiudad = new Object();

    $scope.localsToFilter = function() {
      indexedCiudades = [];
      return $scope.locals;
    }

    $scope.filterCiudad = function(local) {
      var ciudadIsNew = indexedCiudades.indexOf(local.ciudad) == -1;
      if (ciudadIsNew) {
        indexedCiudades.push(local.ciudad);
        $scope.localsPerCiudad[local.ciudad] = 1;
      }
      else{
        $scope.localsPerCiudad[local.ciudad]++;
      }
      // console.log($scope.localsPerCiudad);
      return ciudadIsNew;
    }
  });

  $scope.refreshLocals = function() {
    // console.log("refreshlocals");
    $http.get(BureoApiUrl + '/locals').then(function (response) {
      $scope.resultados = response.data.length;
      $scope.locals = response.data;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.showModalLocal = function(local) {
    console.log("showModalLocal");
    $scope.local = local;
    localModal();
  };

  function localModal(){
    console.log("localModal");
    $ionicModal.fromTemplateUrl('templates/partylocal/modal/local-modal-publish.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalLocal = modal;
      $scope.modalLocal.show();
      mapService.loadMap($scope.local.coordy, $scope.local.coordx, '', $scope.local.avatar, 'local-map');
    });
  }

  $scope.publishPartylocal = function (localid){
    // console.log("publishPartylocal");
    $scope.modalLocal.remove();
    $state.go('app.publishPartylocal', {'localid':$scope.local.id});
  }
})

.controller('PublishPartylocalCtrl', function($scope, $rootScope, $http, $state, $stateParams, $timeout, $ionicPopup, BureoApiUrl, findElementInArray, PartyPictures, uploadImage, $cordovaGeolocation, Location, serializeData, $ionicSlideBoxDelegate, $ionicModal, ionicTimePicker, $ionicLoading, autoLogin, imagePicker, $cordovaImagePicker, $cordovaFileTransfer) {
  // console.log("PublishPartylocalCtrl");
  // imagePicker.pick(2);

  if($rootScope.bureano.id == null){
    autoLogin.login();
  }

  console.log('PublishPartylocalCtrl');
  
  $scope.selectedImages = [];
  /* VARIABLES */

  var localid = $stateParams.localid;
  // console.log("localid: ",localid);
  $scope.local = {};

  /* New Party */
  var partylocalEmpty = {
    nombre:null,
    descripcion:null,
    fecha:null,
    horainicio: new Date(0),
    puntualidad:null,
    invitados:10,
    edadmax:null,
    edadmin:18,
    localid:localid,
    bureanoid:null,
    musicas:[]
  };

  $scope.partylocal = partylocalEmpty;

  $scope.musicas = [];
  
  //variable para guardar la fecha y transformarla antes de enviarla
  $scope.selected = {
    date: new Date(),
  };

  $scope.todaysDate = new Date();

  //Variable para validar el formulario
  $scope.errors = {
    music : true,
    date : false,
  };

  /* FUNCIONES */

  /* Crear vista */
  $http.get(BureoApiUrl + '/locals/' + localid).then(function (response) {
    $ionicLoading.show();
    $scope.local = response.data;
    $ionicLoading.hide();
    // console.log($scope.local);
  });

  $scope.set_start_time = function() {
    var ipObj1 = {
    callback: function (val) {      //Mandatory
      if (typeof (val) === 'undefined') {
      } else {
        var selectedTime = new Date(val * 1000);
        $scope.partylocal.horainicio = selectedTime.getTime();
        // $scope.validateForm();
        // console.log("time 1:",val," time 2",selectedTime.getTime());
        // $scope.partylocal.hora_inicio= selectedTime.getUTCHours();
        // $scope.partylocal.minutos_inicio= selectedTime.getUTCMinutes();
      }

    },
    inputTime: new Date(($scope.partylocal.horainicio)/1000),   //Optional
    format: 24,         //Optional
    step: 15,           //Optional        
    setLabel: 'OK',
    closeLabel: 'Cerrar',
    };

    ionicTimePicker.openTimePicker(ipObj1);
  };

  //Lista para rellenar la cantidad de invitados de 1 a 50
  $scope.invitados = [];
  for (var i = 1; i <= 50; i++) {
      $scope.invitados.push(i);
  }

  //Lista para rellenar la cantidad de edades mínimas 18 a 99
  $scope.edadmin = [];
  for (var i = 18; i <= 50; i++) {
      $scope.edadmin.push(i);
  }

  //Lista para rellenar la cantidad de edades mínimas 18 a 99
  $scope.edadmax = [];
  for (var i = 18; i <= 50; i++) {
      $scope.edadmax.push(i);
  }

  /* Validar Fecha */
  $scope.checkDate = function (selectedDate, todaysDate){
    if(selectedDate < todaysDate)
      $scope.errors.date = true;
    else
      $scope.errors.date = false;
  }

  /* Validar Musica seleccionada */
  $scope.toggleMusic = function (music, form) {
    if ($scope.partylocal.musicas.indexOf(music.id) === -1) {
      $scope.partylocal.musicas.push(music.id);
    } else {
      $scope.partylocal.musicas.splice($scope.partylocal.musicas.indexOf(music.id), 1);
    }
    // console.log("$scope.partylocal.musicas", $scope.partylocal.musicas);
    // Validación de música seleccionada    
    if($scope.partylocal.musicas.length > 0){
      $scope.errors.music = false;
    }
    else{
      $scope.errors.music = true;
    }
  };

  /**
   * Utiliza el servicio para obtener imágenes desde la galería del móvil y las muestra en galería
   */
  $scope.selectImages = function (){
    imagePicker.pick(6).then ( function ( result ) {
      var selectedImages = result
      console.log("selectedImages controller", selectedImages);
      if(selectedImages.length > 0){
        $scope.selectedImages = [];
        angular.forEach(selectedImages, function(value, key){
          var selectedImage = {
            src : value.src,
            thumb : value.src,
            type : value.type,
          };
          $scope.selectedImages.push(selectedImage);
        });
      }
    }, function(error){
    });
  };

  $scope.uploadImages = function (){
    uploadImages($scope.selectedImages, 120)
  }
  
  function uploadImages(images, solicitudid){
    console.log(images);
    var i = 0;
    $scope.partylocal = partylocalEmpty;
    
    images.forEach( function (image) {
      i+=1;
      console.log("images.forEach:", i);
      console.log(image);
      var filePath = image.src;

      var options = {
        fileKey: "image",
        fileName: "image",
        chunkedMode: false,
        // mimeType: "multipart/form-data",
        mimeType: image.type,
        headers: {'Bureo-Authorization' : "Bearer " + $rootScope.bureano.access_token},
        params: {
          'bureanoid': $rootScope.bureano.id,
        }
      };
      var url = BureoApiUrl + '/solicitudparties/' + solicitudid + '/image';

      $cordovaFileTransfer.upload(url, filePath, options).then(function (result) {
        console.log("result:",result);
      }, function (error) {
        $ionicLoading.hide();
        console.error("ERROR: " + JSON.stringify(error));
      }, function (progress) {        
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner> <br/> Subiendo imágen ' + i 
        });
      });
    });

    $ionicLoading.hide();
    var alertPopup = $ionicPopup.alert({
      title: "Solicitud enviada",
      template: 'La solicitud ha sido enviada, puedes consultarla en "Tus solicitudes"'
    });

    $state.go('app.mySolicitudes');

    // angular.forEach(images, function(image, key) {
    //   console.log("angular.forEach:",key, image.src);
    // });

    // angular.forEach(images, function(image, key) {
    //   $ionicLoading.show({
    //     template: '<ion-spinner></ion-spinner> <br/> Subiendo imágen ' + (key+1) 
    //   });
    //   console.log(image);
    //   var filePath = image.src;

    //   var options = {
    //     fileKey: "image",
    //     fileName: "image",
    //     chunkedMode: false,
    //     // mimeType: "multipart/form-data",
    //     mimeType: image.type,
    //     headers: {'Bureo-Authorization' : "Bearer " + $rootScope.bureano.access_token},
    //     params: {
    //       'bureanoid': $rootScope.bureano.id,
    //     }
    //   };
    //   var url = BureoApiUrl + '/solicitudparties/' + solicitudid + '/image';

    //   $cordovaFileTransfer.upload(url, filePath, options).then(function (result) {
    //     console.log("result:",result);
    //   }, function (error) {
    //     $ionicLoading.hide();
    //     console.error("ERROR: " + JSON.stringify(error));
    //   }, function (progress) {
    //     console.log("Progress");
    //   });
    // });

    // angular.forEach(images, function(image, key) {
    //   $ionicLoading.show({
    //     template: '<ion-spinner></ion-spinner> <br/> Subiendo imágen ' + (key+1) 
    //   });
    //   console.log(image);
    //   var filePath = image.src;

    //   var options = {
    //     fileKey: "image",
    //     fileName: "image",
    //     chunkedMode: false,
    //     // mimeType: "multipart/form-data",
    //     mimeType: image.type,
    //     headers: {'Bureo-Authorization' : "Bearer " + $rootScope.bureano.access_token},
    //     params: {
    //       'bureanoid': $rootScope.bureano.id,
    //     }
    //   };
    //   var url = BureoApiUrl + '/solicitudparties/' + solicitudid + '/image';

    //   $cordovaFileTransfer.upload(url, filePath, options).then(function (result) {
    //     console.log("result:",result);
    //   }, function (error) {
    //     $ionicLoading.hide();
    //     console.error("ERROR: " + JSON.stringify(error));
    //   }, function (progress) {
    //     console.log("Progress");
    //   });
    // });
    
    // $ionicLoading.hide();
    // var alertPopup = $ionicPopup.alert({
    //   title: "Solicitud enviada",
    //   template: 'La solicitud ha sido enviada, puedes consultarla en "Tus solicitudes"'
    // });

    // $scope.partylocal = {};
    // $state.go('app.mySolicitudes');
  };

  $scope.publishPartylocal = function (){
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> <br/> Enviando solicitud...'
    });
    var partylocal = $scope.partylocal;
    partylocal.bureanoid = $rootScope.bureano.id;
    partylocal.fecha = Math.round($scope.selected.date.getTime() / 1000);

    $http.post(BureoApiUrl + '/solicitudparties', partylocal)
    .success(function (response) {
      console.log("Solicitud creada: ",response);
      $ionicLoading.hide();
      uploadImages($scope.selectedImages, response.id);
    })
    .error(function(error) {
      $ionicLoading.hide();
      // console.error("error en publishPartylocal");   
      var alertPopup = $ionicPopup.alert({
        title: "Error",
        template: JSON.stringify($rootScope.rejection.data)
      });
    }); 
  };
})
