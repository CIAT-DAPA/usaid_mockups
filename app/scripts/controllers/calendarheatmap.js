'use strict';

/**
 * @ngdoc function
 * @name usaidMockupsApp.controller:CalendarheatmapCtrl
 * @description
 * # CalendarheatmapCtrl
 * Controller of the usaidMockupsApp
 */
angular.module('usaidMockupsApp')
  .controller('CalendarheatmapCtrl', function ($scope, $routeParams, cultivoFactory) {

    $scope.tipoCultivo = $routeParams.cultivoID;
    cultivoFactory.listar($scope.tipoCultivo).then(function (data) {

      var f174 = D3Graphics.CalendarHeatmap;
      f174.vars.container = '#chartF174';

      f174.render(data.filter(function (item) {
        return item.Variedad == 'F174';
      }));

      var f2000 = D3Graphics.CalendarHeatmap;
      f2000.vars.container = '#chartF2000';
      f174.render(data.filter(function (item) {
        return item.Variedad == 'F2000';
      }));

    });
    

  });

