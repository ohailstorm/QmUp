'use strict';

angular.module('qmUpApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth, $window) {
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
      $http.get('/api/playlists/search/'+ argument).success(function(response) {
      $scope.playlists = response;
      console.log(response);
            //socket.syncUpdates('playlist', $scope.playlists);
      });
    }
        

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
