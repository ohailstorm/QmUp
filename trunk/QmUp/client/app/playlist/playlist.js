'use strict';

angular.module('qmUpApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/playlist/:id', {
        templateUrl: 'app/playlist/playlist.html',
        controller: 'PlaylistCtrl'
      });
  });
