'use strict';

angular.module('qmUpApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/add-playlist', {
        templateUrl: 'app/add-playlist/add-playlist.html',
        controller: 'AddPlaylistCtrl'
      });
  });
