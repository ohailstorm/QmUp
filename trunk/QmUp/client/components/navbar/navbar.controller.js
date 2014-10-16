'use strict';

angular.module('qmUpApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $window, playListService, playerService) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    },
    {
      'title': 'Playlists',
      'link': 'playlists'
    },
        {
      'title': 'My playlists',
      'link': 'add-playlist'
    }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;


    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };


    $scope.playlistId=playerService.getPlayingPlaylistId();
    $scope.currentTrack=playerService.nowPlaying();

    $scope.$watch(function(){return playerService.nowPlaying();}, function(newTrack) {
    console.log("newTrack:", newTrack);
             $scope.currentTrack=newTrack;
             $scope.playlistId=playerService.getPlayingPlaylistId();
           });
 $scope.$watch(function(){return playerService.isPlaying();}, function(isPlaying) {
    console.log("navbar:", isPlaying);
             $scope.isPlaying=isPlaying;
           });

  });