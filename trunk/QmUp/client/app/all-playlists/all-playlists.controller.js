'use strict';

angular.module('qmUpApp')
  .controller('AllPlaylistsCtrl', function ($scope, $http, socket, Auth, playlistResource) {
    $scope.playlists = [];
    
    $scope.loggedIn = Auth.isLoggedIn();


playlistResource.query({}).$promise.then(
  function(response) {
            $scope.playlists = response;          
            socket.syncUpdates('playlist', $scope.playlists);           
          },
          function  (response, status) {
            // on error...
          }
  );

    
  });
