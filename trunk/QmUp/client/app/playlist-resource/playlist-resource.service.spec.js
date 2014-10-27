'use strict';

describe('Service: playlistResource', function () {

  // load the service's module
  beforeEach(module('qmUpApp'));

  // instantiate service
  var playlistResource;
  beforeEach(inject(function (_playlistResource_) {
    playlistResource = _playlistResource_;
  }));

  it('should do something', function () {
    expect(!!playlistResource).toBe(true);
  });

});
