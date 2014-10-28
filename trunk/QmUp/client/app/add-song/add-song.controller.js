'use strict';

angular.module('qmUpApp')
  .controller('AddSongCtrl', function ($scope, $http, socket, $routeParams, playlistResource) {
    $scope.playlist = [];
    
    $scope.plId = $routeParams.id;
    console.log($routeParams.id);
/*
  $http.get('/api/playlists/'+$scope.plId).success(function(response) {
      			$scope.playlist = response;
      			console.log(response);
      			socket.syncUpdates('song', $scope.playlist.songs);
    			});
*/

playlistResource.get({id: $scope.plId}).$promise.then(
  function(response) {

            $scope.playlist = response;
            console.log(response);
            socket.syncUpdates('song', $scope.playlist.songs);

          },
          function  (response, status) {
            // on error...
            console.log("error", response, status);
          }
  );

/*
  $scope.add = function (argument) {
  	counter++;
  
	$http.post('/api/playlists/'+$scope.plId, newTrack ).success(function (argument) {
		console.log('response:',argument);
		console.log($scope.playlist.songs);

	});
  	
  }*/
  });
