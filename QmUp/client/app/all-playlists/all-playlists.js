'use strict';

angular.module('qmUpApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/playlists', {
        templateUrl: 'app/all-playlists/all-playlists.html',
        controller: 'AllPlaylistsCtrl'
      });
  });
