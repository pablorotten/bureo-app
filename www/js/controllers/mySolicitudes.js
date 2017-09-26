angular.module('bureo.controllers')
.controller('MySolicitudesCtrl', function($scope, $rootScope, $http, $stateParams, $timeout, $ionicLoading, $ionicPopup, $ionicModal, autoLogin, BureoApiUrl, mapService) {
  if($rootScope.bureano.id == null){
    autoLogin.login();
  }

  $scope.solicitudes = {};
  //Solicitud seleccionada para mostrar en la ventana Modal
  $scope.solicitud = {};

  var link = BureoApiUrl + '/solicitudparties';
  var solicitudes;

  $http.get(link).then(function (response) {
    $ionicLoading.show();
    $scope.resultados=response.data.length;
    solicitudes = response.data;
    $scope.solicitudes = solicitudes;
    $ionicLoading.hide();
  });


  $scope.refreshSolicitudes = function() {
    $http.get(link)
    .then(function(response) {
      $scope.resultados=response.data.length;
      solicitudes = response.data;
      console.log(solicitudes);
      $scope.solicitudes = solicitudes;
      $scope.$broadcast('scroll.refreshComplete');
    })
    .catch(function(response) { 
      var alertPopup = $ionicPopup.alert({
        title: 'Error '+$rootScope.httpErrorCode,
        template: $rootScope.errorData.message
      }); 
      $scope.$broadcast('scroll.refreshComplete');
    })    
  };

  /* MY SOLICITUD */

  /**
   * Creación de la ventana modal de la solicitud de party del bureano
   */
  
  $scope.showModalMySolicitud = function(idSolicitud) {
    console.log("showModalMySolicitud: idSolicitud",idSolicitud);
    var solicitud = $scope.solicitudes.filter(function(solicitud) {
      return solicitud.id == idSolicitud;
    });
    $scope.solicitud = solicitud[0];
    console.log("showModalMySolicitud: $scope.solicitud",$scope.solicitud);
    if($scope.solicitud.fotossolicitudparty != null){
      $scope.fotos = [];
      angular.forEach($scope.solicitud.fotossolicitudparty, function(value, key){
        var foto = {
          src : value.url,
          thumb : value.url,
        };
        $scope.fotos.push(foto);
      });
    };

    modalMySolicitud();
  };

  function modalMySolicitud(){
    $ionicModal.fromTemplateUrl('templates/partylocal/modal/my-solicitud-modal.html', { 
    // $ionicModal.fromTemplateUrl('templates/partylocal/modal/local-modal.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function(modal) {
      console.log('modalMySolicitud: $scope.solicitud',$scope.solicitud);
      $scope.mySolicitudModal = modal;
      $scope.mySolicitudModal.show();
    });
  };  

  /* LOCAL DE LA SOLICITUD */

  function localModal(local){
    $ionicModal.fromTemplateUrl('templates/partylocal/modal/local-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalLocal = modal;
      $scope.local = local;
      $scope.modalLocal.show();
      mapService.loadMap(local.coordy, local.coordx, '', local.avatar, 'local-map');
    });
  }

  $scope.showModalLocal = function(local) {
    localModal(local);
  };

  $scope.closeModalLocal = function() {
    $scope.modalLocal.remove();
  };
});