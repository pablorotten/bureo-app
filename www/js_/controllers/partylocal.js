angular.module('bureo.controllers')
.controller('PartylocalsCtrl', function($scope, $rootScope, $http, $stateParams, $timeout, errorInterceptor, $ionicLoading, $ionicPopup, BureoApiUrl) {
  $scope.parties = {};
  var link = BureoApiUrl + '/partylocals';
  var parties;

  $http.get(link).then(function (response) {
    $ionicLoading.show();
    $scope.resultados=response.data.length;
    parties = response.data;
    $scope.parties = parties;
    $ionicLoading.hide();
  });

  $scope.refreshParties = function() {
    $http.get(link).then(function (response) {
      $scope.resultados=response.data.length;
      parties = response.data;
      $scope.parties = parties;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
})

.controller('PartylocalCtrl', function($scope, $rootScope, $http, $stateParams, $timeout, errorInterceptor, serializeData, $ionicLoading, $ionicSlideBoxDelegate, $ionicPopup, $ionicModal, autoLogin, $filter, BureoApiUrl) {
  // console.log("ViewPartyCtrl");
  // console.log("$rootScope.bureano.id",$rootScope.bureano.id);
  const JOIN = "join";
  const ADD = "add";

  if($rootScope.bureano.id == null){
    autoLogin.login();
  }

  //Party que se visualiza
  $scope.partylocal = {};

  //Variable para unisrse a Party
  $scope.bureanoParty = {
    bureanoid: null,
    packid: null,
    invitados: 0,
    cantidad: 1,
  };  

  //Variable para añadir un Pack a la Party
  $scope.bureanoAddPack = {
    bureanoid: null,
    packid: null,
    invitados: 0,
    cantidad: 1,
  };  

  //Guardamos la información que une al Bureano con la Partylocal
  $scope.partylocalAttendance = {};

  //Indica si el Bureano pertenece a la party o es el creador
  $scope.bureanoInParty = false;

  //Lista para rellenar la cantidad de packs de 1 a 10
  $scope.lista = [];
  for (var i = 1; i <= 10; i++) {
      $scope.lista.push(i);
  }

  //variable para mostrar el local en la ventana modal
  $scope.local = {}

  //Función para calcular la lista de cantidad de invitados posibles en función del numero de packs seleccionado
  $scope.getInvitados = function(num) {
    var list = [];
    for (var i = 0; i <= num; i++) {
        list.push(i);
    }
    return list;
  }

  /**
   * Obtenemos la Partylocal seleccionada
   */
  
  var partyId = $stateParams.id;
  var party;

  $http.get(BureoApiUrl + '/partylocals/' + partyId).then(function (response) {
    $ionicLoading.show();
    party = response.data;
    $scope.partylocal = party;
    console.log("party",party);
    bureanoInParty(party);
    //Actualizamos el slider
    setTimeout(function() {
      $ionicLoading.hide();
      $ionicSlideBoxDelegate.slide(0);
      $ionicSlideBoxDelegate.update();
      $scope.$apply();
    }); 
  });

  /**
   * Actualizar la party local
   */
  $scope.refreshParty = function() {
    $http.get(BureoApiUrl + '/partylocals/' + partyId).then(function (response) {
      party = response.data;
      $scope.partylocal = party;
      bureanoInParty(party);
      //Actualizamos el slider
      setTimeout(function() {
        $ionicSlideBoxDelegate.slide(0);
        $ionicSlideBoxDelegate.update();
        $scope.$apply();
        $scope.$broadcast('scroll.refreshComplete');
      }); 
    });
  };

  /**
   * Comprueba si el Bureano está en la Party
   */
  function bureanoInParty(party){    
    if($rootScope.bureano.id == party.bureanoid)
      $scope.bureanoInParty = true;
    else{
      var bureanoInPartyAux= party.bureanos.filter(function (bureanoInParty) {
        return (bureanoInParty.id == $rootScope.bureano.id);
      });
      if(bureanoInPartyAux.length == 1)
        $scope.bureanoInParty = true;
    }
  }

  /* JOIN-PACKS */
  
  /**
   * Creacion de la ventana modal de PACKS
   */
  function packsModal(){
    $ionicModal.fromTemplateUrl('templates/partyLocal/modal/packs-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalPacks = modal;
      $scope.modalPacks.show();
    });
  }

  $scope.showModalPacks = function() {
    packsModal();
  };

  //Seleccionar Pack
  $scope.selectPack = function(pack) {
    $scope.bureanoParty.packid = pack.id;
    //Creacion del Modal Pack
    packModal();
  };

  /* JOIN-PACK */

  /**
   * Creacion de la ventana modal de PACK
   */
  function packModal(){
    $ionicModal.fromTemplateUrl('templates/partyLocal/modal/pack-modal.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function(modal) {
      $scope.modalPack = modal;
      $scope.modalPack.show();
      // console.log("packModal() $scope.bureanoParty:",$scope.bureanoParty);
    });
  }

  $scope.closeModalPack = function() {
    $scope.bureanoParty = {
      bureanoid: null,
      packid: null,
      invitados: 0,
      cantidad: 1,
    };  
    $scope.modalPack.remove();
  };

  //Muestra la ventana modal de Pago con la opcion JOIN
  $scope.joinPartyCheckout = function() { 
    pagoModal(JOIN);
  };

  /* ADD PACKS */

  function addPacksModal(){
    $ionicModal.fromTemplateUrl('templates/partyLocal/modal/addPacks-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.addPacksModal = modal;
      $scope.addPacksModal.show();
    });
  }

  $scope.showAddPacksModal = function() {
    addPacksModal();
  };

  //Seleccionar Pack
  $scope.addPack = function(pack) {
    $scope.bureanoAddPack.packid = pack.id;
    addPackModal();
  };

  /* ADD-PACK */

  /**
   * Creacion de la ventana modal de PACK
   */
  function addPackModal(){
    $ionicModal.fromTemplateUrl('templates/partyLocal/modal/addPack-modal.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function(modal) {
      $scope.addPackModal = modal;
      $scope.addPackModal.show();
      console.log("addPackModal $scope.bureanoAddPack:",$scope.bureanoAddPack);
    });
  }

  $scope.closeAddModalPack = function() {
    $scope.bureanoAddPack = {
      bureanoid: null,
      packid: null,
      invitados: 0,
      cantidad: 1,
    };  
    $scope.addPackModal.remove();
  };

  //Muestra la ventana modal de Pago con la opcion ADD
  $scope.addPackCheckout = function() { 
    pagoModal(ADD);
  };

  /* PAGO */

  /**
   * Creacion de la ventana modal de PAGO
   */
  function pagoModal(checkout){
    $ionicModal.fromTemplateUrl('templates/partyLocal/modal/payement-modal.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function(modal) {
      $scope.modalPayement = modal;
      $scope.checkout = checkout;
      $scope.modalPayement.show();
    });
  }

  /* FUNCIONES PARA ENVIAR AL SERVIDOR EL PACK Y APUNTARSE A LA PARTY */

  /**
   * Envía una petición al servidor para apuntar al Bureano a una Party
   * con el Pack seleccionado. Si realiza la petición con éxito, elimina
   * todas las ventanas modales abiertas para seleccionar el Pack y realizar
   * el pago. Finalemente guarda en 'partylocalAttendance' la información
   * de la participación del Bureano en la Partylocal
   */
  $scope.joinParty = function() {
    $ionicLoading.show();    
    $scope.bureanoParty.bureanoid = $rootScope.bureano.id;
    var url = BureoApiUrl + '/partylocals/' + party.id + '/join-party';
    var bureanoParty = $scope.bureanoParty;
    
    console.log("Nos unimos a la party --> joinParty: ", $scope.bureanoParty);
    console.log("url", url);

    $http.post(url, bureanoParty)
    .success(function (response) {
      $ionicLoading.hide();
      $scope.partylocalAttendance = response;
      $scope.modalPayement.remove();
      $scope.modalPack.remove();
      $scope.modalPacks.remove();
      $scope.refreshParty();
      modalPartylocalAttendance();
      var alertPopup = $ionicPopup.alert({
        title: 'Felicidades',
        template: 'Ya formas parte de esta Party!!!'
      });
    })
    .error(function(error) 
    {
      $ionicLoading.hide();
      console.error("error en joinParty: ", $rootScope.errorData); 
      var alertPopup = $ionicPopup.alert({
        title: 'Error '+$rootScope.httpErrorCode,
        template: $rootScope.errorData.message
      }); 
      // $scope.modalPayement.remove();
    });
  };

  /**
   * Envía una petición al servidor para añadir Packs a una party
   * a la que previamente se ha apuntado
   */
  $scope.addPackToParty = function() {
    $ionicLoading.show();
    $scope.bureanoAddPack.bureanoid = $rootScope.bureano.id;
    var url_addPackToParty = BureoApiUrl + '/partylocals/' + party.id + '/add-pack';
    var bureanoAddPack = $scope.bureanoAddPack;
    
    console.log("Añadimos un pack a la party --> addPackToParty():", $scope.bureanoAddPack);
    console.log("url_addPackToParty", url_addPackToParty);

    $http.post(url_addPackToParty, bureanoAddPack)
    .success(function (response) {
      $ionicLoading.hide();
      $scope.partylocalAttendance = response;
      $scope.addPacksModal.remove();
      $scope.addPackModal.remove();
      $scope.modalPayement.remove();
      $scope.refreshParty();
      modalPartylocalAttendance();
      var alertPopup = $ionicPopup.alert({
        title: 'Felicidades',
        template: 'Pack añadido a la Party'
      });
    })
    .error(function(error) 
    {
      $ionicLoading.hide();
      console.error("error en addPackToParty: ", $rootScope.errorData); 
      var alertPopup = $ionicPopup.alert({
        title: 'Error '+$rootScope.httpErrorCode,
        template: $rootScope.errorData.message
      }); 
      // $scope.modalPayement.remove();
    });
  };

  /* ATTENDANCE */

  /**
   * Creación de la ventana modal de la unión entre el Bureano y la Partylocal con los 
   * Packs seleccionados
   */
  
  function modalPartylocalAttendance(){
    $ionicModal.fromTemplateUrl('templates/partyLocal/modal/partylocalAttendance-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      /**
       * Obtenemos la Participación en la Partylocal seleccionada
       */
      var link_partylocalAttendance = BureoApiUrl + '/partylocals/' + party.id + '/bureano/' + $rootScope.bureano.id;
      var partylocalAttendance;
      
      $http.get(link_partylocalAttendance).then(function (response) {
        $ionicLoading.show();
        partylocalAttendance = response.data;
        $scope.partylocalAttendance = partylocalAttendance;
        $scope.modalPartylocalAttendance = modal;
        $scope.modalPartylocalAttendance.show();
        $ionicLoading.hide();
      });
    });
  };

  $scope.showModalPartylocalAttendance = function() {
    modalPartylocalAttendance();
  };
  
  /* LOCAL */
  
  function localModal(){
    $ionicModal.fromTemplateUrl('templates/partyLocal/modal/local-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalLocal = modal;
      $scope.local = $scope.partylocal.local;
      $scope.modalLocal.show();
    });
  }

  $scope.showModalLocal = function() {
    localModal();
  };

  $scope.closeModalLocal = function() {
    $scope.modalLocal.remove();
  };

})
;