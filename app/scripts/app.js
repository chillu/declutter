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
  .factory('Things', function($localStorage) {
    if($localStorage.things === undefined) {
      $localStorage.things = [];
    }

    return $localStorage.things;
  })
  .factory('Preferences', function($localStorage) {
    if($localStorage.preferences === undefined) {
      $localStorage.preferences = {
        "remindDayOfWeek": "Sunday", 
        "remindHour": 9,
        "remindOptAlias": "3m"
      };
    }

    return $localStorage.preferences;
  })
  .factory('camera', ['$rootScope', '$q', function($rootScope, $q, env) {
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
                  if(i == fileInput.files.length) {
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
            quality: 75,
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