'use strict';

describe('Controller: AddPlaylistCtrl', function () {

  // load the controller's module
  beforeEach(module('fullstackTestApp'));

  var AddPlaylistCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddPlaylistCtrl = $controller('AddPlaylistCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
