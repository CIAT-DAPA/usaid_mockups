'use strict';

describe('Controller: BarchartCtrl', function () {

  // load the controller's module
  beforeEach(module('usaidMockupsApp'));

  var BarchartCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BarchartCtrl = $controller('BarchartCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BarchartCtrl.awesomeThings.length).toBe(3);
  });
});
