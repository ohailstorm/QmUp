'use strict';

angular.module('qmUpApp')
    .controller('MainCtrl', function($scope, $http, socket, Auth, $window, playlistResource, $modal) {
        $scope.awesomeThings = [];

        $scope.isLoggedIn = Auth.isLoggedIn;

        $scope.loginOauth = function(provider) {
            $window.location.href = '/auth/' + provider;
        };

        $scope.searchForPlaylist = function(argument) {
            playlistResource.searchPlaylist({
                key: argument
            }).$promise.then(
                function(response) {
                    $scope.playlists = response;
                }
            );
        };

        $scope.aboutModal = function(argument) {
            var modalInstance = $modal.open({
                templateUrl: 'app/main/about-modal.html',
                resolve: {
                    info: function() {
                        var aboutInfo = {};
                        return aboutInfo;
                    }
                },
                scope: $scope,
                controller: 'ModalInstanceCtrl'
            });
        }


        $scope.$on('$destroy', function() {
            socket.unsyncUpdates('thing');
            socket.unsyncUpdates('playlist');
        });
    });