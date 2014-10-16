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
				console.log(sound);
				
				scService.play(sound);					
				
				



			}, function (error) {
				//On Error
				console.log("error");
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
	var collaborators=[];
	var played=[];
	var owner;


	//playlist = [{"kind":"track","id":146379385,"created_at":"2014/04/25 07:06:19 +0000","user_id":49063453,"duration":190162,"commentable":true,"state":"finished","original_content_size":4565009,"sharing":"public","tag_list":"","permalink":"wake-me-up","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":null,"label_id":null,"purchase_title":null,"genre":"Acoustic","title":"Wake me up","description":"","label_name":null,"release":null,"track_type":null,"key_signature":null,"isrc":null,"video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/146379385","user":{"id":49063453,"kind":"user","permalink":"hallstroms","username":"Kajsa & Fredrika","uri":"https://api.soundcloud.com/users/49063453","permalink_url":"http://soundcloud.com/hallstroms","avatar_url":"https://i1.sndcdn.com/avatars-000080187945-1q9v95-large.jpg?e76cf77"},"permalink_url":"http://soundcloud.com/hallstroms/wake-me-up","artwork_url":null,"waveform_url":"https://w1.sndcdn.com/fX8HQgWNkVZw_m.png","stream_url":"https://api.soundcloud.com/tracks/146379385/stream","playback_count":114,"download_count":0,"favoritings_count":5,"comment_count":2,"attachments_uri":"https://api.soundcloud.com/tracks/146379385/attachments","policy":"ALLOW","$$hashKey":"004"},{"kind":"track","id":146379623,"created_at":"2014/04/25 07:09:48 +0000","user_id":49063453,"duration":156566,"commentable":true,"state":"finished","original_content_size":3758760,"sharing":"public","tag_list":"","permalink":"kids","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":null,"label_id":null,"purchase_title":null,"genre":"Acoustic","title":"Kids","description":"","label_name":null,"release":null,"track_type":null,"key_signature":null,"isrc":null,"video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/146379623","user":{"id":49063453,"kind":"user","permalink":"hallstroms","username":"Kajsa & Fredrika","uri":"https://api.soundcloud.com/users/49063453","permalink_url":"http://soundcloud.com/hallstroms","avatar_url":"https://i1.sndcdn.com/avatars-000080187945-1q9v95-large.jpg?e76cf77"},"permalink_url":"http://soundcloud.com/hallstroms/kids","artwork_url":null,"waveform_url":"https://w1.sndcdn.com/BlDM9ATGsuy0_m.png","stream_url":"https://api.soundcloud.com/tracks/146379623/stream","playback_count":555,"download_count":0,"favoritings_count":7,"comment_count":3,"attachments_uri":"https://api.soundcloud.com/tracks/146379623/attachments","policy":"ALLOW","$$hashKey":"005"},{"kind":"track","id":146378826,"created_at":"2014/04/25 07:01:10 +0000","user_id":49063453,"duration":259001,"commentable":true,"state":"finished","original_content_size":6217012,"sharing":"public","tag_list":"","permalink":"home","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":null,"label_id":null,"purchase_title":null,"genre":"","title":"Home","description":"","label_name":"","release":"","track_type":"","key_signature":"","isrc":"","video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/146378826","user":{"id":49063453,"kind":"user","permalink":"hallstroms","username":"Kajsa & Fredrika","uri":"https://api.soundcloud.com/users/49063453","permalink_url":"http://soundcloud.com/hallstroms","avatar_url":"https://i1.sndcdn.com/avatars-000080187945-1q9v95-large.jpg?e76cf77"},"permalink_url":"http://soundcloud.com/hallstroms/home","artwork_url":null,"waveform_url":"https://w1.sndcdn.com/1R6iWtTzxS1J_m.png","stream_url":"https://api.soundcloud.com/tracks/146378826/stream","playback_count":245,"download_count":0,"favoritings_count":8,"comment_count":0,"attachments_uri":"https://api.soundcloud.com/tracks/146378826/attachments","policy":"ALLOW","$$hashKey":"006"},{"kind":"track","id":146379507,"created_at":"2014/04/25 07:08:11 +0000","user_id":49063453,"duration":164820,"commentable":true,"state":"finished","original_content_size":3956883,"sharing":"public","tag_list":"","permalink":"pumped-up-kicks","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":null,"label_id":null,"purchase_title":null,"genre":"Acoustic","title":"Pumped up kicks","description":"","label_name":null,"release":null,"track_type":null,"key_signature":null,"isrc":null,"video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/146379507","user":{"id":49063453,"kind":"user","permalink":"hallstroms","username":"Kajsa & Fredrika","uri":"https://api.soundcloud.com/users/49063453","permalink_url":"http://soundcloud.com/hallstroms","avatar_url":"https://i1.sndcdn.com/avatars-000080187945-1q9v95-large.jpg?e76cf77"},"permalink_url":"http://soundcloud.com/hallstroms/pumped-up-kicks","artwork_url":null,"waveform_url":"https://w1.sndcdn.com/DYh9sdmDcR6O_m.png","stream_url":"https://api.soundcloud.com/tracks/146379507/stream","playback_count":147,"download_count":0,"favoritings_count":7,"comment_count":1,"attachments_uri":"https://api.soundcloud.com/tracks/146379507/attachments","policy":"ALLOW","$$hashKey":"007"}] ;



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
      			owner = response.owner;
      			console.log(response);
      			socket.syncUpdates(id, playlist);
    			});
			   
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
			//if(playlist.length<=0 || playlist.indexOf(newTrack)<=0)
				$http.post('/api/playlists/'+playlistId, track).error(function (response, status) {
					alert("Something went wrong: " + response.message);
					console.log(response.message);
				});
				//playlist.push(newTrack);
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
		}


	};

	 $rootScope.$on('$destroy', function () {
      socket.unsyncUpdates(playlistId);
    });

	return playListOperations;
	

	
});
