'use strict';

describe('Controller: CcultivoCtrl', function () {

  // load the controller's module
  beforeEach(module('usaidMockupsApp'));

  var CcultivoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CcultivoCtrl = $controller('CcultivoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CcultivoCtrl.awesomeThings.length).toBe(3);
  });
});
