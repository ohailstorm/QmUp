'use strict';

angular.module('qmUpApp')

  .controller('PlaylistCtrl', function ($scope, playerService, playListService, $routeParams, $http, Auth, $modal, socket, playlistResource) {

	$scope.currentTrack;
	$scope.allowRemoteSkipping=false;
	$scope.isPlaying=false;
	if(playListService.getPlayListId()!==$routeParams.id){
		playerService.clearAll();
	playListService.setPlaylistId($routeParams.id);
		playerService.setTrack();
		$scope.isPlaying=false;

	}
		var id=$routeParams.id;
 
		socket.socket.on(id+':skip',function (data) {
			console.log("skip", data);
			if($scope.allowRemoteSkipping){
  				$scope.skip();						
			}
  	
            });

	//$scope.playlist = playListService.getPlayList();
	$scope.searchResult = [];
	$scope.playing= false;
	
	var player;
	var trackNo=0;
	$scope.trackNo=trackNo;
	var current;

	$scope.nrSearchRes = 25;
	$scope.numbers = [10,25,50,100];

	$scope.playlist=playListService.getPlaylist();
	   $scope.playlistOwner=playListService.getOwner();

	
  $scope.getFriendsList = function () {

    $http.get('https://graph.facebook.com/me/friends?access_token='+Auth.getCurrentUser().fbToken).success( 
      function (response) {
      console.log(response.data);
      $scope.friendsList = response.data;
    }

      );
   
  };


	$scope.play = function  (track) {
		
		//if(playerService.currentTrack){
			$scope.isPlaying=true;
			playerService.play();
		//}
		//else{
			/*$scope.currentTrack = playListService.getCurrentTrack();
			playerService.setTrack($scope.currentTrack);
			*/
		//}
	};

	$scope.pause = function (argument) {
		$scope.isPlaying=false;
	if($scope.currentTrack)
				playerService.pause($scope.currentTrack);
	};


	$scope.search = function (searchStr, lim) {
		socket.socket.emit("skip", playListService.getPlayListId());
		SC.get('/tracks', {q: searchStr, limit: lim}, function(tracks) {
			$scope.$apply(function() {$scope.searchResult = tracks});

			console.log($scope.searchResult);
			
		
		});
			
	}


	$scope.addToPlayList = function (track) {
		
		/*
		if($scope.playlist.length<=0 || $scope.playlist.indexOf(track)<=0)
		$scope.playlist.push(track);
		if($scope.playlist.length==1){

			$scope.play(track);
		}*/
		console.log(track);
		playListService.addTrack(track);
		

	};

	$scope.skip = function () {
		playerService.skip();
	};

	$scope.isAdmin = function () {
		if($scope.playlistOwner){
		return Auth.isLoggedIn() && Auth.getCurrentUser()._id===$scope.playlistOwner._id;

		}
		else return false;
	};

	$scope.removeTrack = function (track) {
		playListService.removeTrack(track._id);
	}

	  $scope.addCollaborator = function (friend) {
    
    var postObject =  {user: friend.id};

   /* $http.post('/api/playlists/'+playListService.getPlayListId()+'/collaborator', postObject).success(function(response) {
            
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
  newCollab.$addCollaborator({id: playListService.getPlayListId()}, function (response) {
    // on success...
    console.log("success!", response);

  },
  function (response, status) {
    console.log(status);
    console.log(response);
  });

  };

  $scope.toggleRemoteSkipping = function () {
  	console.log("toggle");
  	$scope.allowRemoteSkipping = !$scope.allowRemoteSkipping;
  }


  $scope.toggleModal = function() {
   var modalInstance = $modal.open({
  		templateUrl:'app/playlist/song-layover.html',
  		resolve:{
  			info: function() {
  				console.log(trackNo);
  				return $scope.currentTrack;
  			}
  		},
  		controller: 'ModalInstanceCtrl'
  	});	
  }

 $scope.$watch(function(){return playListService.getCurrentTrack();}, function(newTrack) {
	 	console.log("change in track");
         $scope.currentTrack=newTrack;
         $scope.playlist=playListService.getPlaylist();

           });/*
  $scope.$watch(function(){return playerService.nowPlaying();}, function(newTrack) {
	 	console.log("change in track");
             $scope.currentTrack=newTrack;
           });*/
           
  $scope.$watch(function(){return playListService.getCollaborators();}, function(collabs) {
	 	console.log("change in track");
             $scope.collaborators=collabs;
         $scope.playlist=playListService.getPlaylist();

            
           });
/*
 $scope.$watch(function(){return playListService.getOwner();}, function(owner) {
	 	console.log("change in pwner");
             $scope.playlistOwner=owner;
         $scope.playlist=playListService.getPlaylist();

            
           });
           
    $scope.$watch(function(){return playListService.playlistLength();}, function(playlist) {
	 	console.log("change in pl");
             $scope.playlist=playListService.getPlaylist();
            
           });/*
 $scope.$watch(function(){return playerService.isPlaying();}, function(isPlaying) {
	 	console.log("playing:", isPlaying);
             $scope.isPlaying=isPlaying;
           });*/


  });


angular.module('qmUpApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, info) {

  $scope.info = info;
  $scope.selected = {
   // item: $scope.items[0]
  };
  console.log("started" + info);

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
