'use strict';

angular.module('qmUpApp')
  .controller('PlaylistInfoCtrl', function ($scope, $http, Auth, socket, $routeParams, playListService, playlistResource) {
   
  	$scope.playlistId=$routeParams.id;
  	$scope.friendsList=[];
    /*
    $http.get('/api/playlists/'+$scope.playlistId).success(function(response) {
			   	
      			$scope.playlist = response;
      			$scope.playlistId=response._id;
      		
      			console.log(response);
      			socket.syncUpdates($scope.playlistId, $scope.playlist);      			
    			});*/
playlistResource.get({id:$scope.playlistId}).$promise.then(
  function(response) {
          
            $scope.playlist = response;
            $scope.playlistId=response._id;
          
            console.log(response);
            socket.syncUpdates($scope.playlistId, $scope.playlist);           
          },
          function  (response, status) {
            // on error...
            console.log("error", response, status);
          }
  )



$scope.isAdmin = function () {
	if($scope.playlist){
		return Auth.isLoggedIn() && Auth.getCurrentUser()._id===$scope.playlist.owner._id;

	}
	else return false;
	};

$scope.remoteSkip = function  () {
	console.log("Skipp");
	if($scope.isAdmin()){
		console.log("admin");
	socket.socket.emit("skip", $scope.playlistId);

	}
}


  $scope.getFriendsList = function () {

    $http.get('https://graph.facebook.com/me/friends?access_token='+Auth.getCurrentUser().fbToken).success( 
      function (response) {
      console.log(response.data);
      $scope.friendsList = response.data;
    }

      );
   
  };

  	  $scope.addCollaborator = function (friend) {
    
    var postObject =  {user: friend.id};
/*
    $http.post('/api/playlists/'+playListService.getPlayListId()+'/collaborator', postObject).success(function(response) {
            
            console.log(response);
            
          }).error(
          function(data,status) {
            console.log(status);
            console.log(data);
          //  alert("Something went wrong");
          }
          );*/


  var newCollab = new playlistResource();
  newCollab.user= friend.id;
  newCollab.$addCollaborator({id: $scope.playlistId}, function (response) {
    // on success...
    console.log("success!", response);

  },
  function (response, status) {
    console.log(status);
    console.log(response);
  });

  };



		

			   
  });
