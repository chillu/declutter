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
      .otherwise({
        redirectTo: '/'
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
