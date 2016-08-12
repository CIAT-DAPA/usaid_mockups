'use strict';

describe('Controller: PieandlineCtrl', function () {

  // load the controller's module
  beforeEach(module('usaidMockupsApp'));

  var PieandlineCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PieandlineCtrl = $controller('PieandlineCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PieandlineCtrl.awesomeThings.length).toBe(3);
  });
});
