'use strict';

angular.module('qmUpApp')
    .controller('UserPlaylistCtrl', function($scope, socket, Auth, $location, playlistResource, $modal) {
        $scope.playlists = [];
        $scope.loggedIn = Auth.isLoggedIn();

        if (!Auth.isLoggedIn()) {
            $location.path('/login');
        }

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

        playlistResource.getPlaylistsForUser({
            userId: Auth.getCurrentUser()._id
        }).$promise.then(
            function(response) {
                $scope.playlists = response;
            },
            function(response, status) {
                // on error...
                console.log("error", response, status);
            }
        );

        $scope.add = function(newName) {
            $scope.closeAlert();
            if (newName !== undefined && newName.length > 0) {
                var own = Auth.getCurrentUser()._id;
                var newTrack = {
                    name: newName,
                    owner: own
                };

                //create resource and set parameters
                var newPlaylist = new playlistResource();
                newPlaylist.name = newName;
                newPlaylist.owner = own;

                //save to resource
                newPlaylist.$save(
                    function(response) {

                        if (response.owner === Auth.getCurrentUser()._id) {

                            response.owner = {
                                _id: response.owner,
                                name: Auth.getCurrentUser().name
                            };
                            $scope.playlists.push(response);
                        }
                        $scope.addAlert('success', 'Successfully created playlist');
                    },
                    function(response, status) {

                        $scope.addAlert('danger', 'Something went wrong! Sorry...');

                    });
            } else {

                $scope.addAlert('danger', 'Unnamed playlist');

            }

        };

        $scope.deleteModal = function(track) {
            var modalInstance = $modal.open({
                templateUrl: 'app/user-playlist/delete-modal.html',
                resolve: {
                    info: function() {
                        return track;
                    }
                },
                scope: $scope,
                controller: 'ModalInstanceCtrl'
            });
        };

        $scope.test = function(argument) {
            console.log(argument);
        }

    });