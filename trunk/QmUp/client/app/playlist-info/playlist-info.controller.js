'use strict';

angular.module('qmUpApp')
  .controller('PlaylistInfoCtrl', function ($scope, $http, Auth, socket, $routeParams) {
   
  	$scope.playlistId=$routeParams.id;

    $http.get('/api/playlists/'+$scope.playlistId).success(function(response) {
			   	
      			$scope.playlist = response;
      			$scope.playlistId=response._id;
      		
      			console.log(response);
      			socket.syncUpdates($scope.playlistId, $scope.playlist);      			
    			});



$scope.isAdmin = function () {
		return Auth.isLoggedIn() && Auth.getCurrentUser()._id===$scope.playlist.owner._id;
	};

$scope.remoteSkip = function  () {
	console.log("Skipp");
	if($scope.isAdmin()){
		console.log("admin");
	socket.socket.emit("skip", $scope.playlistId);

	}
}


		

			   
  });
