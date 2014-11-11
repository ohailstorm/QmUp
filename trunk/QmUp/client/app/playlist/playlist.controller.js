'use strict';

angular.module('qmUpApp')

.controller('PlaylistCtrl', function($scope, playerService, playListService, $routeParams, $http, Auth, $modal, socket, playlistResource, $interval) {
    $scope.alerts = [];

    $scope.currentTrack;
    $scope.allowRemoteSkipping = false;
    $scope.isPlaying = false;
   
    /*
    if (playListService.getPlayListId() !== $routeParams.id) {
        playerService.clearAll();
        playListService.setPlaylistId($routeParams.id);
        playerService.setTrack();
        $scope.isPlaying = false;

    }*/
    if (playListService.getPlayListId() !== $routeParams.id) {
        playlistResource.get({
            id: $routeParams.id
        }).$promise.then(function(response) {


                playListService.setPlaylist(response);
                $scope.playlist = playListService.getPlaylist();
                $scope.playlist = playListService.getPlaylist();
                $scope.playlistOwner = playListService.getOwner();
                $scope.name = playListService.getName();
            },
            function(response) {
                // body...
            });
    }
    var id = $routeParams.id;

    socket.socket.on(id + ':skip', function(data) {
        console.log("skip", data);
        if ($scope.allowRemoteSkipping) {
            $scope.skip();
        }

    });

    //$scope.playlist = playListService.getPlayList();
    $scope.searchResult = [];
    $scope.playing = false;

    var player;
    var trackNo = 0;
    $scope.trackNo = trackNo;
    var current;

    $scope.nrSearchRes = 25;
    $scope.numbers = [10, 25, 50, 100];

    $scope.playlist = playListService.getPlaylist();

    $scope.playlistOwner = playListService.getOwner();
    $scope.name = playListService.getName();
    $scope.collaborators;


    $scope.getFriendsList = function() {

        $http.get('https://graph.facebook.com/me/friends?access_token=' + Auth.getCurrentUser().fbToken).success(
            function(response) {
                console.log(response.data);
                $scope.friendsList = response.data;
            }

        );

    };


    $scope.play = function(track) {

        $scope.isPlaying = true;
        playerService.play();
        $interval(function () {
        $scope.currentPosition = playerService.getPosition();
        $scope.currentProgress = $scope.currentPosition/playerService.getDuration()*100;
        },
        1000);
    
    };

    $scope.pause = function(argument) {
        $scope.isPlaying = false;
        if ($scope.currentTrack)
            playerService.pause($scope.currentTrack);
    };


    $scope.search = function(searchStr, lim) {
        socket.socket.emit("skip", playListService.getPlayListId());
        SC.get('/tracks', {
            q: searchStr,
            limit: lim
        }, function(tracks) {
            $scope.$apply(function() {
                $scope.searchResult = tracks
            });

            console.log($scope.searchResult);


        });

    }


    $scope.addToPlayList = function(track) {

   
        console.log(track);
        playListService.addTrack(track);


    };

    $scope.skip = function() {
        playerService.skip();
        if(!$scope.isPlaying){
       $interval(function () {
        $scope.currentPosition = playerService.getPosition();
        $scope.currentProgress = $scope.currentPosition/playerService.getDuration()*100;
        },
        1000);
        }
         

    };

    $scope.isAdmin = function() {
        if ($scope.playlistOwner) {
            return Auth.isLoggedIn() && Auth.getCurrentUser()._id === $scope.playlistOwner._id;

        } else return false;
    };

    $scope.isCollab = function() {
        if ($scope.playlist) {
            if(Auth.isLoggedIn()){
                if(_.find($scope.collaborators, {_id: Auth.getCurrentUser()._id})){
                   // console.log("collab",_.find($scope.collaborators, {_id: Auth.getCurrentUser()._id}));
                    return true;
                }
                else return false;
                 

        } 
    }

        return false;
    };

    $scope.removeTrack = function(track) {
            if(track._id===playerService.nowPlaying()._id){
                $scope.skip();
            }
            playListService.removeTrack(track._id);
        }


    $scope.addCollaborator = function(friend) {
        //$scope.closeAlert();
        var newCollab = new playlistResource();
        newCollab.user = friend.id;
        newCollab.$addCollaborator({
                id: playListService.getPlayListId()
            },
            function(response) {
                // on success...
                console.log("success!", response);

                $scope.collaborators.push(response); // hack

            },
            function(response) {
                if (response.status === 409) {
                    $scope.alerts.push({
                        type: 'danger',
                        msg: friend.name + ' is already a collaborator!'
                    });
                    $scope.alerts = _.uniq($scope.alerts, function(alert) {
                        return alert.msg;
                    });
                } else if (response.status === 404) {
                    $scope.alerts.push({
                        type: 'danger',
                        msg: friend.name + ' is not using QmUp. Let them know!'
                    });
                    $scope.alerts = _.uniq($scope.alerts, function(alert) {
                        return alert.msg;
                    });
                }
            });

    };

    $scope.removeCollaborator = function(collaborator) {
        playlistResource.removeCollaborator({
                id: playListService.getPlayListId(),
                userId: collaborator._id
            })
            .$promise.then(
                function(response) {
                    // on success...
                    _.remove($scope.collaborators, collaborator);
                    console.log(response);
                },
                function function_name(response) {
                    console.log("error", response);
                    // on error...
                }
            )
    };

    $scope.toggleRemoteSkipping = function() {
        console.log("toggle");
        $scope.allowRemoteSkipping = !$scope.allowRemoteSkipping;
    }


    $scope.openModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'app/playlist/song-layover.html',
            resolve: {
                info: function() {
                    console.log(trackNo);
                    return $scope.currentTrack;
                }
            },
            controller: 'ModalInstanceCtrl'
        });
    };

    $scope.addAlert = function(type, newMsg) {
        $scope.alerts.push({
            type: type,
            msg: newMsg
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.$watch(function() {
        return playListService.getCurrentTrack();
    }, function(newTrack) {
        console.log("change in track");
        $scope.currentTrack = newTrack;
        $scope.playlist = playListService.getPlaylist();

    });
  

    $scope.$watch(function() {
        return playListService.getCollaborators();
    }, function(collabs) {
        console.log("change in track");
        $scope.collaborators = collabs;
        $scope.playlist = playListService.getPlaylist();
        $scope.name = playListService.getName();
        $scope.playlistOwner = playListService.getOwner();

    });

    $scope.$watch(function() {
        return playerService.isPlaying();
    }, function(isPlaying) {
        console.log("playing:", isPlaying);
        $scope.isPlaying = isPlaying;
    });

    $scope.$watch(function() {
        return playerService.getDuration();
    }, function(duration) {
        
        $scope.duration = duration;
    });
});


angular.module('qmUpApp').controller('ModalInstanceCtrl', function($scope, $modalInstance, info) {

    $scope.info = info;
    $scope.selected = {
        // item: $scope.items[0]
    };
    console.log("started" + info);

    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});