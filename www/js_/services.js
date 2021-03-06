'use strict';
angular.module('bureo.services', ['ionic', 'ngCordova'])
.service('helloWorldFromService', function() {
  this.sayHello = function() {
    return "Hello, World!";
  };
})

.service('serializeData', function() {
  this.serialize = function(data) {
    // If this is not an object, defer to native stringification.
    if ( ! angular.isObject( data ) ) { 
      return( ( data == null ) ? "" : data.toString() ); 
    }
    var buffer = [];
    // Serialize each key in the object.
    for ( var name in data ) { 
      if ( ! data.hasOwnProperty( name ) ) { 
        continue; 
      }
      var value = data[ name ];
      buffer.push(
        encodeURIComponent( name ) + "=" + encodeURIComponent( ( value == null ) ? "" : value )
      ); 
    }
    // Serialize the buffer and clean it up for transportation.
    var source = buffer.join( "&" ).replace( /%20/g, "+" ); 
    return( source ); 
  };  
}) 

.service('autoLogin', function(serializeData, $http, $rootScope, BureoApiUrl) {
  this.login = function(data){
  console.log("autoLogin");

  var url = BureoApiUrl + "/bureanos/login";
  var data = {
    username:'bureano',
    password:'bureano123',
  };

  $http.post(url, data)
    .success(function (response) {   
    $rootScope.bureano = response;
    $http.defaults.headers.common['Bureo-Authorization'] = "Bearer "+$rootScope.bureano.access_token;
    })
    .error(function(error) {
    console.error("error en Login"); 
    }); 
  }
})

.service('findElementInArray', function () {
  this.findElement = function(arr, propName, propValue){
  for (var i=0; i < arr.length; i++)
  if (arr[i][propName] == propValue)
    return arr[i];
  };
  // will return undefined if not found; you could return a default instead
})

  /**
   * Carga el mapa con la localización de la Party a partir de la Localización del Local
   */

.service('mapService', function (){
  this.loadMap = function (latitude, longitude, title, iconImage, id){
    console.log("loadMap:",latitude,longitude,title);
    var latLng = new google.maps.LatLng(latitude, longitude);
    console.log("latitude",latitude," longitude",longitude," latLng",latLng," iconImage",iconImage," id",id);

    var mapOptions = {
      center: latLng,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };

    // var map = new google.maps.Map(document.getElementById("google-map"), mapOptions); 
    var map = new google.maps.Map(document.getElementById(id), mapOptions);

    google.maps.event.addListenerOnce(map, 'idle', function(){
      var icon = {
        url: iconImage, // url
        scaledSize: new google.maps.Size(40, 40), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0),
      };

      var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: title,
        label: title,
        icon: icon,
      });
    });
  }
})

.service('uploadImage', function(){
  this.upload = function(options, targetPath, url) { 
    console.log("uploadImage to user "+userID);
    // Destination URL 
     
    //File for Upload
    var targetPath = $scope.newUser.avatar;

    var options = {
      fileKey: "file",
      fileName: "file",
      chunkedMode: false,
      mimeType: "multipart/form-data",
      // mimeType: "image/jpg",
    };

    var extension = targetPath.substring(targetPath.lastIndexOf('.') + 1).toLowerCase();
    var url = BureoApiUrl+'/usuarios/imagen/' + userID + '/extension/'+extension;
    
    console.log("Vamos a enviar:");
    console.log("url:",url);
    console.log("targetPath:",targetPath);
    console.log("options:",options);

    $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
      console.log("SUCCESS: " + JSON.stringify(result.response));
      console.log(result.response);
      $rootScope.user.avatar = BureoApiUrl+JSON.parse(result.response);
      console.log("$rootScope.user ", $rootScope.user);
      $state.go('app.home');
    }, function (err) {
      console.log("ERROR: " + JSON.stringify(err));
    }, function (progress) {
      console.log("Progress");
    });
  };  
})

.factory('errorInterceptor', function ($q, $rootScope) {

  var preventFurtherRequests = false;

  return {
    // 'request': function (config) {
    //     console.info(config);
    //     //set timeout for all request
    //     config.timeout = 5000;
    //     return config;
    // },
    'requestError': function (rejection) {
      console.info(rejection);
      return $q.reject(rejection);
    },
    // 'response': function (response) {
    //     return response;
    // },
    'responseError': function (rejection) {
      console.log("~~interceptor response error~~");
      // console.log(rejection);
      console.log("rejection.data.status:",rejection.status);
      console.log("rejection.data:",angular.toJson(rejection.data));
      $rootScope.httpErrorCode=rejection.status;      
      $rootScope.errorData=rejection.data;
      $rootScope.rejection=rejection;

      return $q.reject(rejection);
    }
  };
})

.factory('PartyCasa', function () { 
  var party = {
    usuario: null,
    nombre: null,
    descripcion: null,
    precio: null,
    invitados: null,
    musica: null,
    lugar: null,
    ciudad: "Granada",
    direccion: null,
    coordx: "0",
    coordy: "0",
    hora_inicio: null,
    minutos_inicio: null,
    hora_fin: null,
    time_inicio: null,
    time_fin: null,
    minutos_fin: null,
    //opciones de fiesta
    option_jardin: 0,
    option_piscina: 0,
    option_tenis: 0,
    option_padel: 0,
    option_billar: 0,
    option_minusvalidos: 0,
    //condiciones de fiesta
    option_alcohol: 0,
    option_comida: 0,
    option_tarde: 0,
    option_mascotas: 0,
    option_fumar: 0,
    //edad
    option_18_25: 0,
    option_26_35: 0,
    option_36_45: 0,
    option_45: 0
  };
 
  return {
    getParty: function () {
      return party;
    },
    setParty: function (newParty) {
      party = newParty;
    }
  };
})

.factory('PartyLocal', function () { 
  var party = {
    usuario: null,
    nombre: null,
    descripcion: null,
    precio: null,
    invitados: null,
    musica: null,
    lugar: null,
    ciudad: "Granada",
    direccion: null,
    coordx: "0",
    coordy: "0",
    hora_inicio: null,
    minutos_inicio: null,
    hora_fin: null,
    time_inicio: null,
    time_fin: null,
    minutos_fin: null,
    //opciones de fiesta
    option_jardin: 0,
    option_piscina: 0,
    option_tenis: 0,
    option_padel: 0,
    option_billar: 0,
    option_minusvalidos: 0,
    //condiciones de fiesta
    option_alcohol: 0,
    option_comida: 0,
    option_tarde: 0,
    option_mascotas: 0,
    option_fumar: 0,
    //edad
    option_18_25: 0,
    option_26_35: 0,
    option_36_45: 0,
    option_45: 0
  };
 
  return {
    getParty: function () {
      return party;
    },
    setParty: function (newParty) {
      party = newParty;
    }
  };
})

.factory('Location', function ($cordovaGeolocation) { 
  var location = {
    lat: 0,
    lon: 0,
  };
 
  return {
    getLocation: function () {
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
    location.lat  = position.coords.latitude;
    location.lon = position.coords.longitude;
    console.log(location.lat + '   ' + location.lon);
    console.log(location);
    }, function(err) {
    console.log(err)
    });
    return location;
    }
  };
})

.factory('applicationsService', ['$resource','$q',  function($resource, $q) {
  var data = [
  {
    "PreAlertInventory": "5.000000",
    "SharesInInventory": "3.000000",
    "TotalSharesSold": "2.000000"
  }
  ];   
  var factory = {
    getCurrentApp: function () {
      var deferred = $q.defer();   

      deferred.resolve(data);

      return deferred.promise;
    }
  }
  return factory;
}])

// .factory('Location', function ($cordovaGeolocation) { 
//     var location = {
//         lat: 0,
//         lon: 0,
//     };
 
//     return {
//         getLocation: function () {
//        var posOptions = {timeout: 10000, enableHighAccuracy: false};
//          $cordovaGeolocation
//      .getCurrentPosition(posOptions)
//      .then(function (position) {
//        location.lat  = position.coords.latitude;
//        location.lon = position.coords.longitude;
//        console.log(location.lat + '   ' + location.lon);
//        console.log(location);
//              return location;
//      }, function(err) {
//        console.log(err)
//      });
//         }
//     };
// })

.factory('PartyPictures', function () { 
  var pictures = [];
 
  return {
    getPartyPictures: function () {
      return pictures;
    },
    setPartyPictures: function (newPictures) {
      pictures = newPictures;
    }
  };
})
;
