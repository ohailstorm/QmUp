'use strict';

angular.module('qmUpApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/add-song/:id', {
        templateUrl: 'app/add-song/add-song.html',
        controller: 'AddSongCtrl'
      });
  });
