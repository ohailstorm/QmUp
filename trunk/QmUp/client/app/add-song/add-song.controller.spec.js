'use strict';

describe('Controller: AddSongCtrl', function () {

  // load the controller's module
  beforeEach(module('qmUpApp'));

  var AddSongCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddSongCtrl = $controller('AddSongCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
