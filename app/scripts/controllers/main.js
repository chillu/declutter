'use strict';

angular.module('declutter')
  .controller('MainCtrl', function ($scope, $location, thingsCollection) {
    $scope.things = thingsCollection;
    $scope.$watch('things');

    $scope.add = function() {
      $location.path('/add');
    };

    $scope.edit = function(index) {
      $location.path('/edit/' + index);
    };
  });
