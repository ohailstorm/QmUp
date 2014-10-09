'use strict';

describe('Controller: AllPlaylistsCtrl', function () {

  // load the controller's module
  beforeEach(module('qmUpApp'));

  var AllPlaylistsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AllPlaylistsCtrl = $controller('AllPlaylistsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
