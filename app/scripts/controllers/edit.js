'use strict';

angular.module('declutter')
  .controller('EditCtrl', function (
    $scope,
    $stateParams,
    $location,
    $timeout,
    $window,
    $ionicPopup,
    uidGenerator,
    userPreferences,
    thingsCollection,
    camera,
    fileSystem,
    localNotification,
    moment
  ) {
    if (angular.isDefined($window.webkitStorageInfo)) {
      $timeout(function() {
        fileSystem.requestQuota(50);
      }, 1000);
    }

    $scope.supportsLocalNotification = (localNotification);
    $scope.things = thingsCollection;
    $scope.$watch('things.items');

    // Set current item
    if($stateParams.id) {
      $scope.thing = $scope.things.findByKey('id', $stateParams.id);
    } else {
      $scope.thing = $scope.things.create();
    }

    // Set reminder date options
    var preferredDate = moment().hour(userPreferences.remindHour).minute(0).second(0).millisecond(0);
    $scope.remindOpts = [
      {
        'title': 'in a minute',
        'alias': 'debug',
        'value': 'debug'
      },
      {
        'title': 'in a week',
        'alias': '1w',
        'value': preferredDate.clone().add('weeks', 1).day(userPreferences.remindDayOfWeek)
      },
      {
        'title': 'in a month',
        'alias': '1m',
        'value': preferredDate.clone().add('months', 1).day(userPreferences.remindDayOfWeek)
      },
      {
        'title': 'in three months',
        'alias': '3m',
        'value': preferredDate.clone().add('months', 3).day(userPreferences.remindDayOfWeek)
      },
      {
        'title': 'in a year',
        'alias': '1y',
        'value': preferredDate.clone().add('months', 12).day(userPreferences.remindDayOfWeek)
      },
      {
        'title': 'never',
        'alias': '',
        'value': ''
      }
    ];

    // Preselect preferred option
    if(!$scope.thing.id) {
      angular.forEach($scope.remindOpts, function(remindOpt) {
        if(remindOpt.alias === userPreferences.remindOptAlias) {
          $scope.thing.remindDate = remindOpt.value;
        }
      });
    }

    $scope.supportsCamera = function() {
      return camera.supportsCamera();
    };

    $scope.getPicture = function(mode) {
      camera.getPicture(mode)
        .then(function(images) {
          // Create a random file name to avoid any later overwrites
          var origFileName = (angular.isObject(images[0])) ? images[0].name : images[0],
            fileExt = origFileName.split('.').pop(),
            fileName = uidGenerator.generate() + '.' + fileExt;

          fileSystem.writeBlob(fileName, images[0]).then(function() {
            fileSystem.getFileEntry(fileName).then(function(fileEntry) {
              $scope.thing.image = fileEntry.toURL();
            })
            .catch(function(err) {console.log(err);});
          })
          .catch(function(err) {console.log(err);});
        })
        .catch(function(err) {console.log(err);});
    };

    $scope.save = function() {
      if(!$scope.thing.id) {
        $scope.things.add($scope.thing);
      }

      if($scope.thing.remindDate === 'debug') {
        $scope.thing.remindDate = moment().add('seconds', 20);
      }

      $scope.things.save($scope.thing);

      // Persist preferred reminder date as new preference
      angular.forEach($scope.remindOpts, function(remindOpt) {
        if(remindOpt.value === $scope.thing.remindDate) {
          userPreferences.remindOptAlias = remindOpt.alias;
        }
      });

      $location.path('/');
    };

    $scope.delete = function() {
      $ionicPopup.confirm({
        title: 'Delete',
        content: 'Are you sure you want to delete this?'
      }).then(function(res) {
        if(res) {
          $scope.things.remove($scope.thing);
          $location.path('/');
        } else {
          console.log('You are not sure');
        }
      });
    };

    $scope.back = function() {
      $location.path('/');
    };
  });
