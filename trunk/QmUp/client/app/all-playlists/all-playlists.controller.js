'use strict';

angular.module('qmUpApp')
  .controller('AllPlaylistsCtrl', function ($scope, $http, socket, Auth) {
    $scope.playlists = [];
    var counter =0;
    $scope.loggedIn = Auth.isLoggedIn();
    console.log(Auth.getCurrentUser());

  $http.get('/api/playlists/').success(function(response) {
      			$scope.playlists = response;
      			console.log(response);
      			socket.syncUpdates('playlist', $scope.playlists);
    			});


    
  });
