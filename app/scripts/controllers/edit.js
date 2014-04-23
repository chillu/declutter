'use strict';

angular.module('declutter')
  .controller('EditCtrl', function ($scope, $routeParams, $location, Preferences, Things, camera) {
    $scope.things = Things;
    $scope.$watch('things');
    
    if($routeParams.id) {
      $scope.thing = Things[$routeParams.id];
    } else {
      $scope.thing = {};
    }
    

    var preferredDate = moment().hour(Preferences.remindHour).minute(0).second(0).millisecond(0);

    $scope.remindOpts = [
      {
        "title": "in a week", 
        "alias": "1w",
        "value": preferredDate.clone().add('weeks', 1).day(Preferences.remindDayOfWeek)
      },
      {
        "title": "in a month", 
        "alias": "1m",
        "value": preferredDate.clone().add('months', 1).day(Preferences.remindDayOfWeek)
      },
      {
        "title": "in three months", 
        "alias": "3m",
        "value": preferredDate.clone().add('months', 3).day(Preferences.remindDayOfWeek)
      },
      {
        "title": "in a year", 
        "alias": "1y",
        "value": preferredDate.clone().add('months', 12).day(Preferences.remindDayOfWeek)
      },
      {
        "title": "never", 
        "alias": "",
        "value": ""
      }
    ];

    // Preselect preferred option
    angular.forEach($scope.remindOpts, function(remindOpt) {
      if(remindOpt.alias == Preferences.remindOptAlias) {
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
          $scope.thing.image = images[0];
        })
        .catch(function(err) {
          console.log(err);
        });
    };

    $scope.save = function() {
      if($routeParams.id) {
        Things[$routeParams.id] = $scope.thing;
      } else {
        Things.push($scope.thing);
      }

      // Presist preferred reminder date as new preference
      angular.forEach($scope.remindOpts, function(remindOpt) {
        if(remindOpt.value == $scope.thing.remindDate) {
          Preferences.remindOptAlias = remindOpt.alias;
        }
      });
      
      $location.path('/');
    };

    $scope.back = function() {
      $location.path('/');
    }
  });
