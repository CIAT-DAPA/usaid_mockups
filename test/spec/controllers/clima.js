'use strict';

describe('Controller: ClimaCtrl', function () {

  // load the controller's module
  beforeEach(module('usaidMockupsApp'));

  var ClimaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClimaCtrl = $controller('ClimaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ClimaCtrl.awesomeThings.length).toBe(3);
  });
});
