'use strict';

describe('Controller: CalendargoogleCtrl', function () {

  // load the controller's module
  beforeEach(module('usaidMockupsApp'));

  var CalendargoogleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CalendargoogleCtrl = $controller('CalendargoogleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CalendargoogleCtrl.awesomeThings.length).toBe(3);
  });
});
