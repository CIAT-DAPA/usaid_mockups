'use strict';

describe('Controller: CalendarheatmapCtrl', function () {

  // load the controller's module
  beforeEach(module('usaidMockupsApp'));

  var CalendarheatmapCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CalendarheatmapCtrl = $controller('CalendarheatmapCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CalendarheatmapCtrl.awesomeThings.length).toBe(3);
  });
});
