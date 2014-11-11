'use strict';

angular.module('qmUpApp')
  .controller('AllPlaylistsCtrl', function ($scope, $http, socket, Auth, playlistResource) {
    $scope.playlists = [];
    
    $scope.loggedIn = Auth.isLoggedIn();
    console.log(Auth.getCurrentUser());

  /*$http.get('/api/playlists/').success(function(response) {
      			$scope.playlists = response;
      			console.log(response);
      			socket.syncUpdates('playlist', $scope.playlists);
    			});*/

playlistResource.query({}).$promise.then(
  function(response) {
          
            $scope.playlists = response;
           
          
            console.log(response);
            socket.syncUpdates('playlist', $scope.playlists);           
          },
          function  (response, status) {
            // on error...
            console.log("error", response, status);
          }
  );

    
  });
