'use strict';

angular.module('qmUpApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $window) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    },
    {
      'title': 'Playlists',
      'link': 'playlists'
    },
        {
      'title': 'My playlists',
      'link': 'add-playlist'
    }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });