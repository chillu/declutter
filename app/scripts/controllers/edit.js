'use strict';

angular.module('declutter')
  .controller('EditCtrl', function (
    $scope,
    $routeParams,
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

    var findByKey = function(items, key, val) {
      var match;
      angular.forEach(items, function(item) {
        if(!match && item[key] === val) {
          match = item;
        }
      });
      return match;
    };

    var deleteByKey = function(items, key, val) {
      angular.forEach(items, function(item, i) {
        if(item[key] === val) {
          items.splice(i,1);
        }
      });
    };

    $scope.supportsLocalNotification = (localNotification);
    $scope.things = thingsCollection;
    $scope.$watch('things');

    // Set current item
    if($routeParams.id) {
      $scope.thing = findByKey(thingsCollection, 'id', $routeParams.id);
    } else {
      $scope.thing = {
        'created': moment()
      };
    }

    // Set reminder date options
    var preferredDate = moment().hour(userPreferences.remindHour).minute(0).second(0).millisecond(0);
    $scope.remindOpts = [
      {
        'title': 'in a minute',
        'alias': '20s',
        'value': moment().add('seconds', 20)
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
    angular.forEach($scope.remindOpts, function(remindOpt) {
      if(remindOpt.alias === userPreferences.remindOptAlias) {
        $scope.thing.remindDate = remindOpt.value;
      }
    });

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
        $scope.thing.id = uidGenerator.generate();
        $scope.things.push($scope.thing);

        // Set or update local notification reminder
        if(localNotification) {
          localNotification.cancel($scope.thing.id);
          if($scope.thing.remindDate) {
            var timeSpan = moment($scope.thing.created).from($scope.thing.remindDate, true),
             title = $scope.thing.title || 'something';

            $scope.thing.remindMessage = 'Time to decide! ' +
               'It\'s been ' + timeSpan + ' since you added "' + title + '" to Declutter. ' +
               'Keep it, or get rid of it?';

            localNotification.add({
              id: $scope.thing.id,
              message: $scope.thing.remindMessage,
              date: new Date(moment($scope.thing.remindDate)),
              // autoCancel: true,
              badge: 1
            });

            console.log('Adding/updating reminder for ' + $scope.thing.id + ' (' + moment($scope.thing.remindDate).format() + ')');  
          } else {
            delete $scope.thing.remindMessage;
          }
        }
      }

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
          if(localNotification) {
            localNotification.cancel($scope.thing.id);
          }
          deleteByKey($scope.things, 'id', $routeParams.id);
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
