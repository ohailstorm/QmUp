'use strict';

angular.module('qmUpApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user-playlist', {
        templateUrl: 'app/user-playlist/user-playlist.html',
        controller: 'UserPlaylistCtrl'
      });
  });
