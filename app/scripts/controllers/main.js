'use strict';

angular.module('declutter')
  .controller('MainCtrl', function ($scope, $location, thingsCollection, localNotification) {
    $scope.things = thingsCollection;
    $scope.$watch('things.items');

    $scope.add = function() {
      $location.path('/add');
    };

    $scope.edit = function(id) {
      $location.path('/edit/' + id);
    };

    if(localNotification.isSupported()) {
      localNotification.onclick = function (id) {
        $location.path('/edit/' + id);
      };
      localNotification.ontrigger = function (id) {
        $location.path('/edit/' + id);
      };
    };
  });
