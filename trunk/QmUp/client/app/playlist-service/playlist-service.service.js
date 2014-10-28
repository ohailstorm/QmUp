'use strict';

angular.module('qmUpApp')
  .factory('playerService',
  	function(playListService, $rootScope) {

  			SC.initialize({
		client_id: "72e3791ab08ac0604b2407aa8fc279cb"
	}, function (response) {
		console.log(response);
	});

  			
	var currentSoundObject;
	var track;
	var playlistId;


	var playing = false;
	var paused=false;
	var scService = {


		setTrack : function  (autoStart) {
			
			track = playListService.getCurrentTrack();
			playlistId=playListService.getPlayListId();
			console.log(track);
			if(track){

			console.log("track",track);

			if(playing && currentSoundObject){
				scService.stop();
				currentSoundObject=null;
			}
			//HACK
			playing=true;
			SC.stream("/tracks/"+ track.id,{onfinish : function(){ playNext(); this.destruct();}}, function(sound){
				playing=false;
				
				scService.play(sound);					

			}, function (error) {
				//On Error
				
				playing=false;
				playNext();
			});

		}
		return autoStart; //HACK
		},

		play : function (sound) {

			if(sound){
				currentSoundObject = sound;
			}
			if(playListService.getPlayListId()!==playlistId){
				scService.setTrack(true);
			}

			if(playing==false){			
					
				if(currentSoundObject){

					playing=true;
					
					console.log(playing);

					currentSoundObject.play({
					    // Exisiting…
					    onload: function() {
					      if (this.readyState == 2) {
					      	//On error
					        console.log("error");
					        playNext();
    					}
    				}
    			});
					
				}
				else{
					scService.setTrack(true);
					console.log("back");
				}
				return playing;

			}


			
		},
		pause : function  (track) {
			if(playing==true){
				playing=false;
				paused=true;
				currentSoundObject.pause();
			}
			return playing;

		},
		skip: function () {
			if(currentSoundObject){
			currentSoundObject.stop();
			currentSoundObject=null;
			playNext();
		}
		},
		stop : function (track) {
			if(currentSoundObject){
			currentSoundObject.stop();
			currentSoundObject=null;
		}
		return playing;
		},
		isPlaying : function () {
			return playing;
		},
		nowPlaying: function () {
			return track;
		},
		getPlayingPlaylistId: function () {
			return playlistId;
		},
		clearAll : function (argument) {
			playing=false;
			if(currentSoundObject){
			currentSoundObject.stop();
			currentSoundObject=null;
			}
			
			track=null;
			playlistId=null;

		}


	};
	function playNext(){
		console.log("end");
		playing=false;
		playListService.getNextTrack();
		console.log(playListService.getCurrentTrack());
		scService.setTrack(true);
	};
	function setPlaying (isPlaying) {
		playing=isPlaying;
	}
	return scService;
})
.factory('playListService', function($http, socket, $rootScope, $routeParams) {

	var trackNo=0;
	var playlist = [];
	var playlistId;
	var playlistName;
	var collaborators=[];
	var played=[];
	var owner;

	var playListOperations = {
		setPlaylistId: function (id) {
			if(playlistId!=id){
				playListOperations.unsyncSocket();
				trackNo=0;
			}
			playlistId = id;

			playlist.splice(0, playlist.length);
			played.splice(0, played.length);
			   $http.get('/api/playlists/'+playlistId).success(function(response) {
			   	
      			playlist = response.songs;
      			collaborators = response.collaborators;
      			playlistName=response.name;
      			owner = response.owner;
      			console.log(response);
      			socket.syncUpdates(id, playlist);
    			});
			   
		},
		setPlaylist: function (newPlaylist) {
			console.log(newPlaylist);
			playListOperations.unsyncSocket();
				playlistId = newPlaylist._id;
				playlist = newPlaylist.songs;
      			collaborators = newPlaylist.collaborators;
      			playlistName= newPlaylist.name;
      			owner = newPlaylist.owner;
      		

      			socket.syncUpdates(playlistId, playlist);
		},
		getPlayListId: function () {
			return playlistId;
		},
		getCurrentTrack: function () {
			if (playlist.length>0) {
				//return playlist[trackNo%playlist.length];
				//return _.difference(playlist, played)[0];
				return playListOperations.getPlaylist()[0];
			}
			else return null;
			
		},
		getNextTrack: function (argument) {
			//trackNo++;
			//playlist.splice(0,1);
			//played.push(_.difference(playlist, played)[0]);
			played.push(playListOperations.getPlaylist()[0]._id);
			
			//console.log('next', _.difference(playlist, played)[0]);
			
			if (playlist.length>0) {
				//return playlist[trackNo%playlist.length];
				//return _.difference(playlist, played)[0];
				playListOperations.getPlaylist()[0];
			}
			else return null;
		},
		addTrack: function (newTrack) {
			console.log("adding", newTrack);
			//Set track properties
			var track={};
			track.id=newTrack.id;
			track.title=newTrack.title;
			track.artist = newTrack.artist;
			track.genre=newTrack.genre;
			track.artworkUrl=newTrack.artwork_url;
			track.postingUser=newTrack.user.username;
			track.userURL=newTrack.user.uri;
			track.videoURL=newTrack.video_url;
			track.label=newTrack.label_name;
			track.releaseYear=newTrack.release_year;

				$http.post('/api/playlists/'+playlistId, track).error(function (response, status) {
					alert("Something went wrong: " + response.message);
					console.log(response.message);
				});
			
		},
		getPlaylist: function () {
			if(trackNo<playlist.length){
			//return playlist.slice(trackNo+1, playlist.length);
			//return _.difference(playlist, played);
			var test = _.select(playlist, function(c){    
    				return played.indexOf(c._id) == -1;
				});
		
			return test;

			}
			else{
				return [];
			}

		},
		playlistLength: function  (argument) {
			return playlist.length;
		},
		removeTrack: function (trackId) {
			console.log('want',trackId);
			console.log('current', playListOperations.getCurrentTrack()._id)
			//if(trackId!==playListOperations.getCurrentTrack()._id){
				$http.delete('/api/playlists/'+playlistId+"/song/"+trackId).success( function (response) {
				console.log("deleted");
				
			});

			//}
		},
		getCollaborators: function () {
			return collaborators;
		},
		getOwner: function () {
			return owner;
		},
		unsyncSocket: function () {
			socket.unsyncUpdates(playlistId);
		},
		getName: function () {
			return playlistName;
		}


	};

	 $rootScope.$on('$destroy', function () {
      socket.unsyncUpdates(playlistId);
    });

	return playListOperations;
	

	
});
