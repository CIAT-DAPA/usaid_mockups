'use strict';

describe('Controller: SpiderCtrl', function () {

  // load the controller's module
  beforeEach(module('usaidMockupsApp'));

  var SpiderCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SpiderCtrl = $controller('SpiderCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SpiderCtrl.awesomeThings.length).toBe(3);
  });
});
