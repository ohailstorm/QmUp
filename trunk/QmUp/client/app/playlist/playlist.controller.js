'use strict';

angular.module('qmUpApp')
  .controller('PlaylistCtrl', function ($scope, playerService, playListService, $routeParams, $http, Auth) {
  



	$scope.currentTrack;
	//$scope.playlist = [{"kind":"track","id":146379385,"created_at":"2014/04/25 07:06:19 +0000","user_id":49063453,"duration":190162,"commentable":true,"state":"finished","original_content_size":4565009,"sharing":"public","tag_list":"","permalink":"wake-me-up","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":null,"label_id":null,"purchase_title":null,"genre":"Acoustic","title":"Wake me up","description":"","label_name":null,"release":null,"track_type":null,"key_signature":null,"isrc":null,"video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/146379385","user":{"id":49063453,"kind":"user","permalink":"hallstroms","username":"Kajsa & Fredrika","uri":"https://api.soundcloud.com/users/49063453","permalink_url":"http://soundcloud.com/hallstroms","avatar_url":"https://i1.sndcdn.com/avatars-000080187945-1q9v95-large.jpg?e76cf77"},"permalink_url":"http://soundcloud.com/hallstroms/wake-me-up","artwork_url":null,"waveform_url":"https://w1.sndcdn.com/fX8HQgWNkVZw_m.png","stream_url":"https://api.soundcloud.com/tracks/146379385/stream","playback_count":114,"download_count":0,"favoritings_count":5,"comment_count":2,"attachments_uri":"https://api.soundcloud.com/tracks/146379385/attachments","policy":"ALLOW","$$hashKey":"004"},{"kind":"track","id":146379623,"created_at":"2014/04/25 07:09:48 +0000","user_id":49063453,"duration":156566,"commentable":true,"state":"finished","original_content_size":3758760,"sharing":"public","tag_list":"","permalink":"kids","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":null,"label_id":null,"purchase_title":null,"genre":"Acoustic","title":"Kids","description":"","label_name":null,"release":null,"track_type":null,"key_signature":null,"isrc":null,"video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/146379623","user":{"id":49063453,"kind":"user","permalink":"hallstroms","username":"Kajsa & Fredrika","uri":"https://api.soundcloud.com/users/49063453","permalink_url":"http://soundcloud.com/hallstroms","avatar_url":"https://i1.sndcdn.com/avatars-000080187945-1q9v95-large.jpg?e76cf77"},"permalink_url":"http://soundcloud.com/hallstroms/kids","artwork_url":null,"waveform_url":"https://w1.sndcdn.com/BlDM9ATGsuy0_m.png","stream_url":"https://api.soundcloud.com/tracks/146379623/stream","playback_count":555,"download_count":0,"favoritings_count":7,"comment_count":3,"attachments_uri":"https://api.soundcloud.com/tracks/146379623/attachments","policy":"ALLOW","$$hashKey":"005"},{"kind":"track","id":146378826,"created_at":"2014/04/25 07:01:10 +0000","user_id":49063453,"duration":259001,"commentable":true,"state":"finished","original_content_size":6217012,"sharing":"public","tag_list":"","permalink":"home","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":null,"label_id":null,"purchase_title":null,"genre":"","title":"Home","description":"","label_name":"","release":"","track_type":"","key_signature":"","isrc":"","video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/146378826","user":{"id":49063453,"kind":"user","permalink":"hallstroms","username":"Kajsa & Fredrika","uri":"https://api.soundcloud.com/users/49063453","permalink_url":"http://soundcloud.com/hallstroms","avatar_url":"https://i1.sndcdn.com/avatars-000080187945-1q9v95-large.jpg?e76cf77"},"permalink_url":"http://soundcloud.com/hallstroms/home","artwork_url":null,"waveform_url":"https://w1.sndcdn.com/1R6iWtTzxS1J_m.png","stream_url":"https://api.soundcloud.com/tracks/146378826/stream","playback_count":245,"download_count":0,"favoritings_count":8,"comment_count":0,"attachments_uri":"https://api.soundcloud.com/tracks/146378826/attachments","policy":"ALLOW","$$hashKey":"006"},{"kind":"track","id":146379507,"created_at":"2014/04/25 07:08:11 +0000","user_id":49063453,"duration":164820,"commentable":true,"state":"finished","original_content_size":3956883,"sharing":"public","tag_list":"","permalink":"pumped-up-kicks","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":null,"label_id":null,"purchase_title":null,"genre":"Acoustic","title":"Pumped up kicks","description":"","label_name":null,"release":null,"track_type":null,"key_signature":null,"isrc":null,"video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/146379507","user":{"id":49063453,"kind":"user","permalink":"hallstroms","username":"Kajsa & Fredrika","uri":"https://api.soundcloud.com/users/49063453","permalink_url":"http://soundcloud.com/hallstroms","avatar_url":"https://i1.sndcdn.com/avatars-000080187945-1q9v95-large.jpg?e76cf77"},"permalink_url":"http://soundcloud.com/hallstroms/pumped-up-kicks","artwork_url":null,"waveform_url":"https://w1.sndcdn.com/DYh9sdmDcR6O_m.png","stream_url":"https://api.soundcloud.com/tracks/146379507/stream","playback_count":147,"download_count":0,"favoritings_count":7,"comment_count":1,"attachments_uri":"https://api.soundcloud.com/tracks/146379507/attachments","policy":"ALLOW","$$hashKey":"007"}] ;
	playListService.setPlaylistId($routeParams.id)
	$scope.playlist = playListService.getPlayList();
	$scope.searchResult = [];
	$scope.playing= false;
	$scope.isPlaying;
	var player;
	var trackNo=0;
	$scope.trackNo=trackNo;
	var current;
	
  $scope.getFriendsList = function () {

    $http.get('https://graph.facebook.com/me/friends?access_token='+Auth.getCurrentUser().fbToken).success( 
      function (response) {
      console.log(response.data);
      $scope.friendsList = response.data;
    }

      );
   
  }


	$scope.play = function  (track) {
		//if(playerService.currentTrack){
			playerService.play();
		//}
		//else{
			/*$scope.currentTrack = playListService.getCurrentTrack();
			playerService.setTrack($scope.currentTrack);
			*/
		//}
	};

	$scope.pause = function (argument) {
	if($scope.currentTrack)
				playerService.pause($scope.currentTrack);
	};

	$scope.search = function (searchStr) {
		SC.get('/tracks', {q: searchStr}, function(tracks) {
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
		playListService.addTrack(track);
		

	};

	$scope.notAllowed = function () {
		playerService.skip();
	};

	$scope.removeTrack = function (track) {
		playListService.removeTrack(track._id);
	}

	  $scope.addCollaborator = function (friend) {
    
    var postObject =  {user: friend.id};

    $http.post('/api/playlists/'+playListService.getPlayListId()+'/collaborator', postObject).success(function(response) {
            $scope.playlists = response;
            console.log(response);
            socket.syncUpdates('playlist', $scope.playlists);
          }).error(
          function(data,status) {
            console.log(status);
            console.log(data);
          }
          );

  };


 $scope.$watch(function(){return playListService.getCurrentTrack();}, function(newTrack) {
	 	console.log("change in track");
             $scope.currentTrack=newTrack;
           });
  $scope.$watch(function(){return playListService.getCollaborators();}, function(playlist) {
	 	console.log("change in track");
             $scope.collaborators=playlist;
             console.log($scope.collaborators);
           });
 $scope.$watch(function(){return playerService.isPlaying();}, function(isPlaying) {
	 	console.log("playing:", isPlaying);
             $scope.isPlaying=isPlaying;
           });


  });
