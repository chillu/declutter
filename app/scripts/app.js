'use strict';

// window.onerror = function(message, url, lineNumber) {
//   console.log('Error: '+message+' in '+url+' at line '+lineNumber);
// };

angular
  .module('declutter', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngStorage',
    'fileSystem',
    'angularMoment',
    'ionic'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/edit/:id', {
        templateUrl: 'views/edit.html',
        controller: 'EditCtrl'
      })
      .when('/add', {
        templateUrl: 'views/edit.html',
        controller: 'EditCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('thingsCollection', function($localStorage) {
    if($localStorage.things === undefined) {
      $localStorage.things = {};
    }

    return $localStorage.things;
  })
  .factory('userPreferences', function($localStorage) {
    if($localStorage.preferences === undefined) {
      $localStorage.preferences = {
        'remindDayOfWeek': 'Sunday',
        'remindHour': 9,
        'remindOptAlias': '3m'
      };
    }

    return $localStorage.preferences;
  })
  .factory('uidGenerator', function() {
    return {
      /**
       * Pseudo UID generator, copied from backBone.localstorage.
       * @return String
       */
      generate: function() {
        function _p8(s) {
          var p = (Math.random().toString(16)+'000000000').substr(2,8);
          return s ? '-' + p.substr(0,4) + '-' + p.substr(4,4) : p ;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
      }
    };
  })
  .config([
    '$compileProvider',
    function($compileProvider) {
      $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file):|data:image\/|filesystem:/);
    }
  ])
  .factory('camera', function($rootScope, $q, fileSystem) {
    return {
      supportsCamera: function() {
        return (navigator.camera !== undefined);
      },
      /**
       * Captures a picture by camera, falling back to upload if not available.
       *
       * @param String mode CAMERA or PHOTOLIBRARY
       * @param Object options
       * @return Promise. Success returns an array of HTML5 File objects.
       */
      getPicture: function(mode, options) {
        var deferred = $q.defer();
        options = options || {};
        if (this.supportsCamera()) {
          var defaultOptions = {
            quality: 40,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            allowEdit: true,
            targetWidth: 500,
            targetHeight: 500
          };
          if(mode === 'CAMERA') {
            options.sourceType = navigator.camera.PictureSourceType.CAMERA;
          } else if(mode === 'PHOTOLIBRARY') {
            options.sourceType = navigator.camera.PictureSourceType.PHOTOLIBRARY;
          } else {
            throw 'Invalid getPicture() mode: ' + mode;
          }
          options = angular.extend(defaultOptions, options);

          // open camera via cordova
          navigator.camera.getPicture(
            function(fileURI) {
              fileSystem.getFileFromLocalFileSystemURL(fileURI).then(function(file) {
                deferred.resolve([file]);
              });
            },
            function(message) {
              deferred.reject(message);
            },
            options
          );

        } else {
          // create file input without appending to DOM
          var fileInput = document.createElement('input');
          fileInput.setAttribute('type', 'file');
          if(options && options.multiple) {
            fileInput.setAttribute('multiple', 'multiple');
          }

          fileInput.onchange = function() {
            deferred.resolve(fileInput.files);
          };

          fileInput.click();
        }

        // return a promise
        return deferred.promise;

      }
    };
  });

angular.element(document).ready(function() {
  if (window.cordova !== undefined) {
    document.addEventListener('deviceready', function() {
      angular.bootstrap(document, ['declutter']);
    }, false);
  } else {
    angular.bootstrap(document, ['declutter']);
  }
});