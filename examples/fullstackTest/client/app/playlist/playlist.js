'use strict';

angular.module('fullstackTestApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/playlist/:id', {
        templateUrl: 'app/playlist/playlist.html',
        controller: 'PlaylistCtrl'
      });
  });
