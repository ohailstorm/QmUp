'use strict';

angular.module('qmUpApp')
  .service('playlistResource', function ($resource) {
  	return $resource('/api/playlists/:id/:action/:key/:userId', 
  		{
  			id: '@_id',
  			action:'@action',
  			key: '@key'
  			 }, 
  			{
  			//Specific methods with custom parameters
  			searchPlaylist:{
  				method: 'GET',
  				params: {
          			action:'search',
          			key: '@key'
       			},
       			isArray: true
  			},
  			addCollaborator:{
  				method: 'POST',
  				params: {
  					id: '@_id',
          			action:'collaborator'
       			}
  			},
  			getPlaylistsForUser:{
  				method:'GET',
  				params: {
  					action:'user',
  					userId: '@_uId'
  				},
            isArray: true
          
  			},
        deleteSong:{
          method: 'DELETE',
          params:{
            action: 'song',
            key: '@key'
          }
        },
        removeCollaborator:{
           method: 'DELETE',
          params:{
            action: 'collaborator',
            userId: '@_uId'
          }
        }
  		}
  		);
    
  });
