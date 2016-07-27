'use strict';

describe('Service: climaFactory', function () {

  // load the service's module
  beforeEach(module('usaidMockupsApp'));

  // instantiate service
  var climaFactory;
  beforeEach(inject(function (_climaFactory_) {
    climaFactory = _climaFactory_;
  }));

  it('should do something', function () {
    expect(!!climaFactory).toBe(true);
  });

});
