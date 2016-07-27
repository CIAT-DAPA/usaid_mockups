'use strict';

describe('Controller: CclimaCtrl', function () {

  // load the controller's module
  beforeEach(module('usaidMockupsApp'));

  var CclimaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CclimaCtrl = $controller('CclimaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CclimaCtrl.awesomeThings.length).toBe(3);
  });
});
