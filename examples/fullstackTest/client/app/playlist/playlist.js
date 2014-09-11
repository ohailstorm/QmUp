'use strict';

angular.module('fullstackTestApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/playlist', {
        templateUrl: 'app/playlist/playlist.html',
        controller: 'PlaylistCtrl'
      });
  });
