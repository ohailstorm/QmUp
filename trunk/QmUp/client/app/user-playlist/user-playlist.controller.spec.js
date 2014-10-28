'use strict';

describe('Controller: UserPlaylistCtrl', function () {

  // load the controller's module
  beforeEach(module('qmUpApp'));

  var AddPlaylistCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddPlaylistCtrl = $controller('UserPlaylistCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
