'use strict';

angular.module('fullstackTestApp')
  .controller('AddPlaylistCtrl', function ($scope, $http, socket) {
    $scope.playlists = [];
    var counter =0;

  $http.get('/api/playlists').success(function(response) {
      			$scope.playlists = response;
      			console.log(response);
      			socket.syncUpdates('playlist', $scope.playlists);
    			});



  $scope.add = function (argument) {
  	counter++;
  	var newTrack = {owner:"owner"+ counter, name: "name" + counter}
	$http.post('/api/playlists', newTrack ).success(function (argument) {
		console.log(argument);

	});
  	
  }
  });
