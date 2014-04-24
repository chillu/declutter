'use strict';

angular
  .module('declutter', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngStorage',
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
  .factory('fileSystem', function ($window, $q) {
    $window.requestFileSystem  = $window.requestFileSystem || $window.webkitRequestFileSystem;
    return {
      requestFileSystem: function(requestedBytes) {
        var deferred = $q.defer();
        requestedBytes = requestedBytes || 50 * 1024 * 1024;

        // Request quota in chrome, or simply use cordova wrapper
        if(!angular.isUndefined($window.webkitStorageInfo)) {
          $window.webkitStorageInfo.requestQuota(
            $window.PERSISTENT,
            requestedBytes,
            function(grantedBytes) {
              $window.requestFileSystem(
                $window.PERSISTENT,
                grantedBytes,
                function(fs) {deferred.resolve(fs);},
                function(err) {deferred.reject(err);}
              );
            },
            function() {
              deferred.reject(arguments);
            }
          );
        } else {
          $window.requestFileSystem(
            $window.PERSISTENT,
            requestedBytes,
            function (fs) {deferred.resolve(fs);},
            function (err) {deferred.reject(err);}
          );
        }

        return deferred.promise;
      }
    };
  })
  .factory('camera', ['$rootScope', '$q', function($rootScope, $q) {
    return {
      supportsCamera: function() {
        return (navigator.camera !== undefined);
      },
      /**
       * Captures a picture by camera, falling back to upload if not available.
       * See http://mircozeiss.com/browser-fallback-for-running-phonegap-camera-plugin-on-localhost/
       *
       * @param Object options
       * @return Promise. Success returns an array Of base64 JPEG image strings.
       */
      getPicture: function(options) {

        // init $q
        var deferred = $q.defer();

        if (!this.supportsCamera()) {

          // create file input without appending to DOM
          var fileInput = document.createElement('input');
          fileInput.setAttribute('type', 'file');
          if(options && options.multiple) {
            fileInput.setAttribute('multiple', 'multiple');
          }

          fileInput.onchange = function() {
            var images = [], i = 0;
            angular.forEach(fileInput.files, function(file) {
              var reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onloadend = function () {
                $rootScope.$apply(function() {
                  i++;
                  // strip beginning from string
                  images.push(reader.result);
                  if(i === fileInput.files.length) {
                    deferred.resolve(images);
                  }
                });
              };
            });
          };

          fileInput.click();

        } else {

          // set some default options
          var defaultOptions = {
            quality: 40,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            allowEdit: true,
            targetWidth: 500,
            targetHeight: 500
          };

          // allow overriding the default options
          options = angular.extend(defaultOptions, options);

          // success callback
          var success = function(imageData) {
            $rootScope.$apply(function() {
              deferred.resolve([imageData]);
            });
          };

          // fail callback
          var fail = function(message) {
            $rootScope.$apply(function() {
              window.alert(message);
              deferred.reject(message);
            });
          };

          // open camera via cordova
          navigator.camera.getPicture(success, fail, options);

        }

        // return a promise
        return deferred.promise;

      }
    };
  }]);

angular.element(document).ready(function() {
  if (window.cordova !== undefined) {
    document.addEventListener('deviceready', function() {
      angular.bootstrap(document, ['declutter']);
    }, false);
  } else {
    angular.bootstrap(document, ['declutter']);
  }
});