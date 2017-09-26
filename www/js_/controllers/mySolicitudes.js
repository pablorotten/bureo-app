angular.module('bureo.controllers')
.controller('MySolicitudesCtrl', function($scope, $rootScope, $http, $stateParams, $timeout, errorInterceptor, $ionicLoading, $ionicPopup, $ionicModal, autoLogin, BureoApiUrl) {
  
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
    var solicitud = $scope.solicitudes.filter(function( solicitud ) {
      return solicitud.id == idSolicitud;
    });
    $scope.solicitud = solicitud[0];
    modalMySolicitud();
  };

  function modalMySolicitud(){
    $ionicModal.fromTemplateUrl('templates/partyLocal/modal/mySolicitud-modal.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function(modal) {
      console.log('modalMySolicitud: $scope.solicitud',$scope.solicitud);
      $scope.mySolicitudModal = modal;
      $scope.mySolicitudModal.show();
    });
  };  

  /* LOCAL DE LA SOLICITUD */

  function localModal(){
    $ionicModal.fromTemplateUrl('templates/partyLocal/modal/local-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalLocal = modal;
      $scope.local = $scope.solicitud.local;
      $scope.modalLocal.show();
    });
  }

  $scope.showModalLocal = function() {
    localModal();
  };

  $scope.closeModalLocal = function() {
    $scope.modalLocal.remove();
  };
});