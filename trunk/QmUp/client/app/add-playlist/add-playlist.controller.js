'use strict';

angular.module('qmUpApp')
.controller('AddPlaylistCtrl', function ($scope, $http, socket, Auth) {
  $scope.playlists = [];
  var counter =0;
  $scope.loggedIn = Auth.isLoggedIn();
  console.log(Auth.getCurrentUser());
  
  //$scope.isError = false;
  $scope.alerts = [
  ];

  $scope.addAlert = function(type,newMsg) {
    $scope.alerts.push({type: type, msg: newMsg});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };


  $http.get('/api/playlists/user/'+Auth.getCurrentUser()._id).success(function(response) {
   $scope.playlists = response;
   console.log(response);
      			//socket.syncUpdates('playlist', $scope.playlists);
         });


  $scope.add = function (newName) {
    $scope.closeAlert();
    if(newName !== undefined && newName.length > 0){

    
    counter++;
    var own = Auth.getCurrentUser()._id;
    var newTrack = {name:newName, owner: own};
    console.log(newTrack);
    $http.post('/api/playlists', newTrack ).success(function (response) {
      console.log(response);
      if(response.owner===Auth.getCurrentUser()._id){

        response.owner={_id:response.owner, name:Auth.getCurrentUser().name};
        $scope.playlists.push(response);
      }
      $scope.addAlert('success',"Successfully created playlist");
    });    
  } else { 
    console.log("Unnamed playlist");
    
    $scope.addAlert('danger', "Unnamed playlist");
    
  };
};

  $scope.lookForPlaylist = function (name) {

  }


  $scope.addCollab = function (playlist) {
    console.log(playlist);
    var postObject =  {user: Auth.getCurrentUser()._id};

    $http.post('/api/playlists/'+playlist._id+'/collaborator', postObject).success(function(response) {
      $scope.playlists = response;
      console.log(response);
      socket.syncUpdates('playlist', $scope.playlists);
    });

  };
});
