'use strict';

angular.module('qmUpApp')
  .controller('AddPlaylistCtrl', function ($scope, $http, socket, Auth) {
    $scope.playlists = [];
    var counter =0;
    $scope.loggedIn = Auth.isLoggedIn();
    console.log(Auth.getCurrentUser());

  $http.get('/api/playlists/user/'+Auth.getCurrentUser()._id).success(function(response) {
      			$scope.playlists = response;
      			console.log(response);
      			socket.syncUpdates('playlist', $scope.playlists);
    			});


  $scope.add = function (name) {
  	counter++;
    var own = Auth.getCurrentUser()._id;
  	var newTrack = {owner: own};
    console.log(newTrack);
	$http.post('/api/playlists', newTrack ).success(function (argument) {
		console.log(argument);

	});    
  };

  $scope.addCollab = function (playlist) {
    console.log(playlist);
    var postObject =  {user: Auth.getCurrentUser()._id};

    $http.post('/api/playlists/'+playlist._id+'/collaborator', postObject).success(function(response) {
            $scope.playlists = response;
            console.log(response);
            socket.syncUpdates('playlist', $scope.playlists);
          });

  }
  });
