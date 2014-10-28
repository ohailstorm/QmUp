'use strict';

angular.module('qmUpApp')
    .controller('PlaylistInfoCtrl', function($scope, $http, Auth, socket, $routeParams, playListService, playlistResource) {
        $scope.alerts = [];

        $scope.addAlert = function(type, newMsg) {
            $scope.alerts.push({
                type: type,
                msg: newMsg
            });
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.playlistId = $routeParams.id;
        $scope.friendsList = [];
        /*
    $http.get('/api/playlists/'+$scope.playlistId).success(function(response) {
          
            $scope.playlist = response;
            $scope.playlistId=response._id;
          
            console.log(response);
            socket.syncUpdates($scope.playlistId, $scope.playlist);           
         });*/
        playlistResource.get({
            id: $scope.playlistId
        }).$promise.then(
            function(response) {

                $scope.playlist = response;
                $scope.playlistId = response._id;

                console.log(response);
                socket.syncUpdates($scope.playlistId, $scope.playlist);
            },
            function(response) {
                // on error...

                console.log("error", response);
            }
        );



        $scope.isAdmin = function() {
            if ($scope.playlist) {
                return Auth.isLoggedIn() && Auth.getCurrentUser()._id === $scope.playlist.owner._id;

            } else return false;
        };

        $scope.remoteSkip = function() {
            if ($scope.isAdmin()) {
                socket.socket.emit("skip", $scope.playlistId);
            }
        };


        $scope.getFriendsList = function() {

            $http.get('https://graph.facebook.com/me/friends?access_token=' + Auth.getCurrentUser().fbToken).success(
                function(response) {
                    console.log(response.data);
                    $scope.friendsList = response.data;
                }

            );

        };

        $scope.addCollaborator = function(friend) {
            //$scope.closeAlert();
            var newCollab = new playlistResource();
            newCollab.user = friend.id;
            newCollab.$addCollaborator({
                    id: $scope.playlistId
                },
                function(response) {
                    // on success...
                    console.log("success!", response);

                    $scope.playlist.collaborators.push(response); // hack

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
                    id: $scope.playlistId,
                    userId: collaborator._id
                })
                .$promise.then(
                    function(response) {
                        // on success...
                        _.remove($scope.playlist.collaborators, collaborator);
                        console.log(response);
                    },
                    function function_name(response) {
                        console.log("error", response);
                        // on error...
                    }
                )
        }






    });