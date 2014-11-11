'use strict';

angular.module('qmUpApp')

.controller('PlaylistCtrl', function($scope, playerService, playListService, $routeParams, $http, Auth, $modal, socket, playlistResource, $interval) {
    $scope.alerts = [];

    $scope.currentTrack;
    $scope.allowRemoteSkipping = false;
    $scope.isPlaying = false;
    var intervalCheck;

    if (playListService.getPlayListId() !== $routeParams.id) {
        playlistResource.get({
            id: $routeParams.id
        }).$promise.then(function(response) {

                playerService.clearAll();
                playListService.setPlaylist(response);
                $scope.playlist = playListService.getPlaylist();
                $scope.playlist = playListService.getPlaylist();
                $scope.playlistOwner = playListService.getOwner();
                $scope.name = playListService.getName();
            },
            function(response) {
                // on error
            });
    }
    var id = $routeParams.id;

    socket.socket.on(id + ':skip', function(data) {
        if ($scope.allowRemoteSkipping) {
            $scope.skip();
        }

    });


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
                $scope.friendsList = response.data;
            }

        );

    };


    $scope.play = function(track) {
        playerService.play();
    };

    $scope.pause = function(argument) {
        playerService.pause();
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

        });

    }


    $scope.addToPlayList = function(track) {


        playListService.addTrack(track);


    };

    $scope.skip = function() {
        playerService.skip();

    };

    $scope.isAdmin = function() {
        if ($scope.playlistOwner) {
            return Auth.isLoggedIn() && Auth.getCurrentUser()._id === $scope.playlistOwner._id;

        } else return false;
    };

    $scope.isCollab = function() {
        if ($scope.playlist) {
            if (Auth.isLoggedIn()) {
                if (_.find($scope.collaborators, {
                        _id: Auth.getCurrentUser()._id
                    })) {
                    return true;
                } else return false;


            }
        }

        return false;
    };

    $scope.removeTrack = function(track) {
        if (playerService.nowPlaying() && track._id === playerService.nowPlaying()._id) {
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
                },
                function function_name(response) {
                    // on error...
                }
            )
    };

    $scope.toggleRemoteSkipping = function() {
        $scope.allowRemoteSkipping = !$scope.allowRemoteSkipping;
    }


    $scope.openModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'app/playlist/song-layover.html',
            resolve: {
                info: function() {
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
        $scope.currentTrack = newTrack;
        $scope.playlist = playListService.getPlaylist();

    });


    $scope.$watch(function() {
        return playListService.getCollaborators();
    }, function(collabs) {
        $scope.collaborators = collabs;
        $scope.playlist = playListService.getPlaylist();
        $scope.name = playListService.getName();
        $scope.playlistOwner = playListService.getOwner();

    });

    $scope.$watch(function() {
        return playerService.isPlaying();
    }, function(isPlaying) {
        $scope.isPlaying = isPlaying;

        if (isPlaying) {
            if (intervalCheck) {
                $interval.cancel(intervalCheck);
                intervalCheck = null;
            }
            //check progress in song
            intervalCheck = $interval(function() {
                    $scope.currentPosition = playerService.getPosition();

                },
                1000);
        }

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

    };


    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});