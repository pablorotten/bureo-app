angular.module('bureo.controllers')
.controller('LocalsPublishCtrl', function($scope, $rootScope, $http, $stateParams, $state, $timeout, errorInterceptor, $ionicLoading, $ionicPopup, $ionicModal, BureoApiUrl) {
  // console.log("IndexPartylocalsCtrl");

  $scope.locals = {};
  $scope.local = {};

  $http.get(BureoApiUrl + '/locals').then(function (response) {
    $ionicLoading.show();
    $scope.resultados = response.data.length;
    $scope.locals = response.data;
    $ionicLoading.hide();
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
    // console.log("showModalLocal");
    $scope.local = local;
    // console.log("$scope.local",$scope.local);
    localModal();
  };

  function localModal(){
    // console.log("localModal");
    $ionicModal.fromTemplateUrl('templates/partylocal/modal/local-modal-publish.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalLocal = modal;
      $scope.modalLocal.show();
    });
  }

  $scope.publishPartylocal = function (localid){
    // console.log("publishPartylocal");
    $scope.modalLocal.remove();
    $state.go('app.publishPartylocal', {'localid':$scope.local.id});
  }
})

.controller('PublishPartylocalCtrl', function($scope, $rootScope, $http, $state, $stateParams, $timeout, $ionicPopup, errorInterceptor, BureoApiUrl, findElementInArray, PartyPictures, uploadImage, $cordovaGeolocation, Location, serializeData, $ionicSlideBoxDelegate, $ionicModal, ionicTimePicker, $ionicLoading, autoLogin) {
  // console.log("PublishPartylocalCtrl");
   
  if($rootScope.bureano.id == null){
    autoLogin.login();
  }

  /* VARIABLES */

  var localid = $stateParams.localid;
  // console.log("localid: ",localid);
  $scope.local = {};

  /* New Party */
  var partylocal = {
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
    musicas:[], 
  };

  $scope.partylocal = partylocal;

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

  $scope.publishPartylocal = function (){
    //Guaradmos la musica seleccionada
    // $scope.partylocal.musicas=Object.keys($scope.musicas);

    partylocal.bureanoid = $rootScope.bureano.id;
    $scope.partylocal.fecha = Math.round($scope.selected.date.getTime() / 1000);
    console.log("send:",$scope.partylocal);

    partylocal = $scope.partylocal;

    $http.post(BureoApiUrl + '/solicitudparties', partylocal)
    .success(function (response) {   
      $ionicLoading.hide();          
      // console.log("response: ",response);
      var alertPopup = $ionicPopup.alert({
        title: "Solicitud enviada",
        template: 'La solicitud ha sido enviada, puedes consultarla en "Tus solicitudes"'
      });
      $state.go('app.mySolicitudes');
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
