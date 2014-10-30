'use strict';

angular.module('qmUpApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth, $window, playlistResource, $modal) {
    $scope.awesomeThings = [];

    $scope.isLoggedIn = Auth.isLoggedIn;

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.searchForPlaylist = function(argument) {
      playlistResource.searchPlaylist({key: argument}).$promise.then(
        function (response) {
        
      $scope.playlists = response;

      //tror vi skippar sockets här?
      //socket.syncUpdates('playlist', $scope.playlists);
        }
        );
    };

$scope.aboutModal = function  (argument) {
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
   

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
      socket.unsyncUpdates('playlist'); 
    });
  });
