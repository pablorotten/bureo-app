angular.module('bureo.controllers')
.controller('MyPartiesCtrl', function($scope, $rootScope, $http, errorInterceptor, $ionicLoading, autoLogin, BureoApiUrl) {
  console.log("myParties");

  if($rootScope.bureano.id == null){
    autoLogin.login();
  }

  $scope.parties = {};
  var link =  BureoApiUrl + '/partylocals/my-parties';
  var parties; 

  var bureanoid = {bureanoid: null};
  bureanoid.bureanoid = $rootScope.bureano.id;

  $http.post(link, bureanoid).then(function (response) {
    console.log("response",response);
    $ionicLoading.show();
    $scope.resultados=response.data.length;
    parties = response.data;
    $scope.parties = parties;
    $ionicLoading.hide();
  });

  $scope.refreshMyParties = function() {
    bureanoid.bureanoid = $rootScope.bureano.id;
    $http.post(link, bureanoid).then(function (response) {
      console.log("response",response);
      $scope.resultados=response.data.length;
      parties = response.data;
      $scope.parties = parties;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.verModalBureanoPartylocal = function(partyid) {
    console.log("showModalBureanoPartylocal partyid",partyid);
    modalBureanoPartylocal(partyid);
  };
})

  /* ATTENDANCE */

  /**
   * Vista de la asistencia (Attendance) de un Bureano a una Partylocal. En el backend llamamos a esto BureanoPartylocal ya que es la
   * tabla intermedia que relaciona a los Bureanos con cada Partylocal a las que asisten
   */
.controller('MyPartyAttendanceCtrl', function($scope, $rootScope, $http, $stateParams, errorInterceptor, $ionicLoading, $ionicModal, autoLogin, BureoApiUrl) {
  console.log("MyPartyAttendanceCtrl");
  
  if($rootScope.bureano.id == null){
    autoLogin.login();
  }

  $scope.refreshAttendance = function() {
    var link_bureanoPartylocal =  BureoApiUrl + '/partylocals/' + partyid + '/bureano/' + $rootScope.bureano.id;
    console.log("link_bureanoPartylocal:",link_bureanoPartylocal);
    var bureanoPartylocal;
    
    $http.get(link_bureanoPartylocal).then(function (response) {
      bureanoPartylocal = response.data;
      $scope.bureanoPartylocal = bureanoPartylocal;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  /**
   * Obtenemos la Asistrencia de la Partylocal seleccionada
   */
  
  var partyid = $stateParams.id;

  /**
   * Obtenemos la Participación en la Partylocal seleccionada
   */
  var link_bureanoPartylocal =  BureoApiUrl + '/partylocals/' + partyid + '/bureano/' + $rootScope.bureano.id;
  console.log("link_bureanoPartylocal:",link_bureanoPartylocal);
  var bureanoPartylocal;
  
  $http.get(link_bureanoPartylocal).then(function (response) {
    $ionicLoading.show();
    bureanoPartylocal = response.data;
    $scope.bureanoPartylocal = bureanoPartylocal;
    $ionicLoading.hide();
  });


  $scope.showModalBureanoPartylocal = function() {
    modalBureanoPartylocal();
  };
  /* LOCAL */
  
  function localModal(){
    $ionicModal.fromTemplateUrl('templates/party-local/modal/local-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalLocal = modal;
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