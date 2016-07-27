'use strict';

describe('Service: cultivoFactory', function () {

  // load the service's module
  beforeEach(module('usaidMockupsApp'));

  // instantiate service
  var cultivoFactory;
  beforeEach(inject(function (_cultivoFactory_) {
    cultivoFactory = _cultivoFactory_;
  }));

  it('should do something', function () {
    expect(!!cultivoFactory).toBe(true);
  });

});
