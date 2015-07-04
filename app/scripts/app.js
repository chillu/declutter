'use strict';

// window.onerror = function(message, url, lineNumber) {
//   console.log('Error: '+message+' in '+url+' at line '+lineNumber);
// };

angular
  .module('declutter', [
    'ngCookies',
    'ngSanitize',
    'ngStorage',
    'fileSystem',
    'angularMoment',
    'ionic'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('edit', {
        url: '/edit/:id',
        templateUrl: 'views/edit.html',
        controller: 'EditCtrl'
      })
      .state('add', {
        url: '/add',
        templateUrl: 'views/edit.html',
        controller: 'EditCtrl'
      });
  })
  .filter('inPast', function(moment) {
    return function(value) {
      if (typeof value === 'undefined' || value === null) {
        return '';
      }
      value = moment(value);
      return value.isBefore(moment());
    };
  })
  .service('thingsCollection', function($localStorage, moment, uidGenerator, localNotification) {
    var self = this;

    if($localStorage.things === undefined) {
      $localStorage.things = [];
    }

    this.items = $localStorage.things;

    var createNotification = function(item) {
      var timeSpan = moment(item.created).from(item.remindDate, true), title = item.title || 'something';

        item.remindMessage = 'Time to decide! ' +
           'It\'s been ' + timeSpan + ' since you added "' + title + '" to Declutter. ' +
           'Keep it, or get rid of it?';

        localNotification.add({
          id: item.id,
          message: item.remindMessage,
          date: new Date(moment(item.remindDate)),
          // autoCancel: true,
          badge: 1
        });

        console.log('Adding/updating reminder for ' + item.id + ' (' + moment(item.remindDate).format() + ')');
    };

    this.create = function(data) {
      return angular.extend({
        'created': moment()
      }, data);
    };

    this.add = function(item) {
      if(!item.id) {
        item.id = uidGenerator.generate();
      }
      self.items.push(item);
    };

    this.remove = function(itemToRemove) {
      angular.forEach(self.items, function(item, i) {
        if(item.id === itemToRemove.id) {
          if(localNotification.isSupported()) {
            localNotification.cancel(item.id);
          }
          self.items.splice(i,1);
        }
      });
    };

    this.save = function(item) {
      // Set or update local notification reminder
      if(localNotification.isSupported()) {
        localNotification.cancel(item.id);
        if(item.remindDate) {
          createNotification(item);
        } else {
          delete item.remindMessage;
        }
      }
    };

    this.findByKey = function(key, val) {
      var match;
      angular.forEach(self.items, function(item) {
        if(!match && item[key] === val) {
          match = item;
        }
      });
      return match;
    };

    return this;
  })
  .service('userPreferences', function($localStorage) {
    if($localStorage.preferences === undefined) {
      $localStorage.preferences = {
        'remindDayOfWeek': 'Sunday',
        'remindHour': 9,
        'remindOptAlias': '3m'
      };
    }

    return $localStorage.preferences;
  })
  .service('uidGenerator', function() {
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
  .service('camera', function($rootScope, $q, fileSystem) {
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
  })
  .factory('localNotification', function($window) {
    return angular.extend(
      angular.isDefined($window.plugin) ? $window.plugin.notification.local : {},
      {
        isSupported: function() {return angular.isDefined($window.plugin);}
      }
    );
  })
  .run(function($location, localNotification, thingsCollection, moment) {
    if(localNotification.isSupported()) {

      // Cancel all notifications which are older than the current date
      localNotification.getScheduledIds(function(ids) {
        angular.forEach(ids, function(id) {
          var thing = thingsCollection.findByKey('id', id);
          if(!thing || thing && (!thing.remindDate) || moment(thing.remindDate).isBefore(moment())) {
            localNotification.cancel(id);
          }
        });
      });

      // Listen to app launches caused by clicking on a notification
      localNotification.onclick = function(id) {
        localNotification.cancel(id);
        $location.path('/edit/' + id);
      };
    }
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