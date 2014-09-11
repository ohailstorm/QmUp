'use strict';

angular.module('fullstackTestApp')
  .controller('AddSongCtrl', function ($scope, $http, socket, $routeParams) {
    $scope.playlist = [];
    var counter =1234;
    $scope.plId = $routeParams.id;
    console.log($routeParams.id);

  $http.get('/api/playlists/'+$scope.plId).success(function(response) {
      			$scope.playlist = response;
      			console.log(response);
      			socket.syncUpdates('song', $scope.playlist.songs);
    			});



  $scope.add = function (argument) {
  	counter++;
  	var newTrack = {owner:"owneasdasdr"+ counter, title: "ip: " + Date.now()}
	$http.post('/api/playlists/'+$scope.plId, newTrack ).success(function (argument) {
		console.log("response:",argument);
		console.log($scope.playlist.songs);

	});
  	
  }
  });
