'use strict';

angular.module('qmUpApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/playlist-info/:id', {
        templateUrl: 'app/playlist-info/playlist-info.html',
        controller: 'PlaylistInfoCtrl'
      });
  });
