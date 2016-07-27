'use strict';

describe('Controller: CultivoCtrl', function () {

  // load the controller's module
  beforeEach(module('usaidMockupsApp'));

  var CultivoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CultivoCtrl = $controller('CultivoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CultivoCtrl.awesomeThings.length).toBe(3);
  });
});
