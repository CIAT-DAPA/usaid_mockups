'use strict';

describe('Service: Clima', function () {

  // load the service's module
  beforeEach(module('usaidMockupsApp'));

  // instantiate service
  var Clima;
  beforeEach(inject(function (_Clima_) {
    Clima = _Clima_;
  }));

  it('should do something', function () {
    expect(!!Clima).toBe(true);
  });

});
