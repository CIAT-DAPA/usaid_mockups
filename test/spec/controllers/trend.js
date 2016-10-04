'use strict';

describe('Controller: TrendCtrl', function () {

  // load the controller's module
  beforeEach(module('usaidMockupsApp'));

  var TrendCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TrendCtrl = $controller('TrendCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TrendCtrl.awesomeThings.length).toBe(3);
  });
});
