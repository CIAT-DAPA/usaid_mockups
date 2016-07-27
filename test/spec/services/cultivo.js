'use strict';

describe('Service: Cultivo', function () {

  // load the service's module
  beforeEach(module('usaidMockupsApp'));

  // instantiate service
  var Cultivo;
  beforeEach(inject(function (_Cultivo_) {
    Cultivo = _Cultivo_;
  }));

  it('should do something', function () {
    expect(!!Cultivo).toBe(true);
  });

});
