angular.module('bureo.controllers')
.controller('StartCtrl', function($scope, $timeout, $stateParams, $ionicHistory, $ionicSideMenuDelegate, autoLogin, $state) {
  $ionicSideMenuDelegate.canDragContent(false);
  
  $scope.test = function() {
    autoLogin.login();
    //Ver parrtylocal 2
    // $state.go('app.partylocals.partylocal', {'id':2});
    //Publicar partylocal en local 1
    // $state.go('app.publishPartylocal', {'localid':1});
    $state.go('app.home');

  }
});