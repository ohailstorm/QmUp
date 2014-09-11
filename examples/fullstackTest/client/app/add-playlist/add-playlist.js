'use strict';

angular.module('fullstackTestApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/add-playlist', {
        templateUrl: 'app/add-playlist/add-playlist.html',
        controller: 'AddPlaylistCtrl'
      });
  });
