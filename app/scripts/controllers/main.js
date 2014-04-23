'use strict';

angular.module('declutter')
  .controller('MainCtrl', function ($scope, $location, Things, camera) {
    $scope.things = Things;
    $scope.$watch('things')

    $scope.add = function() {
      $location.path('/add');
    };

    $scope.edit = function(index) {
      $location.path('/edit/' + index);
    };
  });
