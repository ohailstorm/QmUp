'use strict';

angular.module('fullstackTestApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing }).success(function (argument) {
        console.log(argument);
      });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id).success(
        function (argument) {
         console.log(argument);
        }
        );
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
