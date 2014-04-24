'use strict';

angular.module('declutter')
  .controller('EditCtrl', function (
    $scope,
    $routeParams,
    $location,
    uidGenerator,
    userPreferences,
    thingsCollection,
    camera,
    fileSystem,
    moment
  ) {
    // Show grant dialog if required
    fileSystem.requestFileSystem();

    $scope.things = thingsCollection;
    $scope.$watch('things');

    if($routeParams.id) {
      $scope.thing = thingsCollection[$routeParams.id];
    } else {
      $scope.thing = {
        'created': moment()
      };
    }


    var preferredDate = moment().hour(userPreferences.remindHour).minute(0).second(0).millisecond(0);

    $scope.remindOpts = [
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

    // can be a button click or anything else
    $scope.getPicture = function() {
      camera.getPicture()
        .then(function(images) {
          fileSystem.requestFileSystem()
            .then(function(fs) {
              console.debug(fs);
            });
          $scope.thing.image = images[0];
        })
        .catch(function(err) {
          console.log(err);
        });
    };

    $scope.save = function() {
      if($routeParams.id) {
        thingsCollection[$routeParams.id] = $scope.thing;
      } else {
        thingsCollection[uidGenerator.generate()] = $scope.thing;
      }

      // Presist preferred reminder date as new preference
      angular.forEach($scope.remindOpts, function(remindOpt) {
        if(remindOpt.value === $scope.thing.remindDate) {
          userPreferences.remindOptAlias = remindOpt.alias;
        }
      });

      $location.path('/');
    };

    $scope.delete = function() {
      delete thingsCollection[$routeParams.id];

      $location.path('/');
    };

    $scope.back = function() {
      $location.path('/');
    };
  });
