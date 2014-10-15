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


	var playing = false;
	var paused=false;
	var scService = {


		setTrack : function  () {
			var track = playListService.getCurrentTrack();
			if(track){

			console.log(track);

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
				



			}, function () {
				//On Error
				playing=false;
			});
		}
		},

		play : function (sound) {

			if(sound){
				currentSoundObject = sound;
			}

			if(playing==false){			
			
				if(currentSoundObject){
					playing=true;
					
					console.log(playing);
					currentSoundObject.play();
					
				}
				else{
					scService.setTrack();
					console.log("back");
				}

			}


			
		},
		pause : function  (track) {
			if(playing==true){
				playing=false;
				paused=true;
				currentSoundObject.pause();
			}

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
		},
		isPlaying : function () {
			return playing;
		}


	};
	function playNext(){
		console.log("end");
		playing=false;
		playListService.getNextTrack();
		scService.setTrack();
	};
	function setPlaying (isPlaying) {
		playing=isPlaying;
	}
	return scService;
})
.factory('playListService', function($http, socket, $rootScope, $routeParams) {

	//var trackNo=0;
	var playlist = [];
	var playlistId;
	var collaborators;


	//playlist = [{"kind":"track","id":146379385,"created_at":"2014/04/25 07:06:19 +0000","user_id":49063453,"duration":190162,"commentable":true,"state":"finished","original_content_size":4565009,"sharing":"public","tag_list":"","permalink":"wake-me-up","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":null,"label_id":null,"purchase_title":null,"genre":"Acoustic","title":"Wake me up","description":"","label_name":null,"release":null,"track_type":null,"key_signature":null,"isrc":null,"video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/146379385","user":{"id":49063453,"kind":"user","permalink":"hallstroms","username":"Kajsa & Fredrika","uri":"https://api.soundcloud.com/users/49063453","permalink_url":"http://soundcloud.com/hallstroms","avatar_url":"https://i1.sndcdn.com/avatars-000080187945-1q9v95-large.jpg?e76cf77"},"permalink_url":"http://soundcloud.com/hallstroms/wake-me-up","artwork_url":null,"waveform_url":"https://w1.sndcdn.com/fX8HQgWNkVZw_m.png","stream_url":"https://api.soundcloud.com/tracks/146379385/stream","playback_count":114,"download_count":0,"favoritings_count":5,"comment_count":2,"attachments_uri":"https://api.soundcloud.com/tracks/146379385/attachments","policy":"ALLOW","$$hashKey":"004"},{"kind":"track","id":146379623,"created_at":"2014/04/25 07:09:48 +0000","user_id":49063453,"duration":156566,"commentable":true,"state":"finished","original_content_size":3758760,"sharing":"public","tag_list":"","permalink":"kids","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":null,"label_id":null,"purchase_title":null,"genre":"Acoustic","title":"Kids","description":"","label_name":null,"release":null,"track_type":null,"key_signature":null,"isrc":null,"video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/146379623","user":{"id":49063453,"kind":"user","permalink":"hallstroms","username":"Kajsa & Fredrika","uri":"https://api.soundcloud.com/users/49063453","permalink_url":"http://soundcloud.com/hallstroms","avatar_url":"https://i1.sndcdn.com/avatars-000080187945-1q9v95-large.jpg?e76cf77"},"permalink_url":"http://soundcloud.com/hallstroms/kids","artwork_url":null,"waveform_url":"https://w1.sndcdn.com/BlDM9ATGsuy0_m.png","stream_url":"https://api.soundcloud.com/tracks/146379623/stream","playback_count":555,"download_count":0,"favoritings_count":7,"comment_count":3,"attachments_uri":"https://api.soundcloud.com/tracks/146379623/attachments","policy":"ALLOW","$$hashKey":"005"},{"kind":"track","id":146378826,"created_at":"2014/04/25 07:01:10 +0000","user_id":49063453,"duration":259001,"commentable":true,"state":"finished","original_content_size":6217012,"sharing":"public","tag_list":"","permalink":"home","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":null,"label_id":null,"purchase_title":null,"genre":"","title":"Home","description":"","label_name":"","release":"","track_type":"","key_signature":"","isrc":"","video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/146378826","user":{"id":49063453,"kind":"user","permalink":"hallstroms","username":"Kajsa & Fredrika","uri":"https://api.soundcloud.com/users/49063453","permalink_url":"http://soundcloud.com/hallstroms","avatar_url":"https://i1.sndcdn.com/avatars-000080187945-1q9v95-large.jpg?e76cf77"},"permalink_url":"http://soundcloud.com/hallstroms/home","artwork_url":null,"waveform_url":"https://w1.sndcdn.com/1R6iWtTzxS1J_m.png","stream_url":"https://api.soundcloud.com/tracks/146378826/stream","playback_count":245,"download_count":0,"favoritings_count":8,"comment_count":0,"attachments_uri":"https://api.soundcloud.com/tracks/146378826/attachments","policy":"ALLOW","$$hashKey":"006"},{"kind":"track","id":146379507,"created_at":"2014/04/25 07:08:11 +0000","user_id":49063453,"duration":164820,"commentable":true,"state":"finished","original_content_size":3956883,"sharing":"public","tag_list":"","permalink":"pumped-up-kicks","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":null,"label_id":null,"purchase_title":null,"genre":"Acoustic","title":"Pumped up kicks","description":"","label_name":null,"release":null,"track_type":null,"key_signature":null,"isrc":null,"video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/146379507","user":{"id":49063453,"kind":"user","permalink":"hallstroms","username":"Kajsa & Fredrika","uri":"https://api.soundcloud.com/users/49063453","permalink_url":"http://soundcloud.com/hallstroms","avatar_url":"https://i1.sndcdn.com/avatars-000080187945-1q9v95-large.jpg?e76cf77"},"permalink_url":"http://soundcloud.com/hallstroms/pumped-up-kicks","artwork_url":null,"waveform_url":"https://w1.sndcdn.com/DYh9sdmDcR6O_m.png","stream_url":"https://api.soundcloud.com/tracks/146379507/stream","playback_count":147,"download_count":0,"favoritings_count":7,"comment_count":1,"attachments_uri":"https://api.soundcloud.com/tracks/146379507/attachments","policy":"ALLOW","$$hashKey":"007"}] ;



	var playListOperations = {
		setPlaylistId: function (id) {
			if(playlistId!=id){
				playListOperations.unsyncSocket();
			}
			playlistId = id;

			playlist=[];
			   $http.get('/api/playlists/'+playlistId).success(function(response) {
      			playlist = response.songs;
      			collaborators = response.collaborators;
      			console.log(response);
      			socket.syncUpdates(id, playlist);
    			});
			   
		},
		getPlayListId: function () {
			return playlistId;
		},
		getCurrentTrack: function () {
			if (playlist.length>0) {
				return playlist[0];
			}
			else return null;
			
		},
		getNextTrack: function (argument) {
			//trackNo++;
			playlist.splice(0,1);
			
			
			if (playlist.length>0) {
				return playlist[0];
			}
			else return null;
		},
		addTrack: function (newTrack) {
			console.log("adding");
			var track={};
			track.id=newTrack.id;
			track.title=newTrack.title;
			//if(playlist.length<=0 || playlist.indexOf(newTrack)<=0)
				$http.post('/api/playlists/'+playlistId, newTrack );
				//playlist.push(newTrack);
		},
		getPlayList: function () {

			return playlist;
		},
		removeTrack: function (trackId) {
			$http.delete('/api/playlists/'+playlistId+"/song/"+trackId).success( function (response) {
				console.log("deleted");
				
			});
		},
		getCollaborators: function () {
			return collaborators;
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
