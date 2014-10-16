'use strict';

describe('Controller: PlaylistInfoCtrl', function () {

  // load the controller's module
  beforeEach(module('qmUpApp'));

  var PlaylistInfoCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlaylistInfoCtrl = $controller('PlaylistInfoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
