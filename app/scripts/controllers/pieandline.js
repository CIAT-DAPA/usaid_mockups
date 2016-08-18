'use strict';

/**
 * @ngdoc function
 * @name usaidMockupsApp.controller:PieandlineCtrl
 * @description
 * # PieandlineCtrl
 * Controller of the usaidMockupsApp
 */
angular.module('usaidMockupsApp')
  .controller('PieandlineCtrl', function (climaFactory) {
    climaFactory.listar().then(function (data) {
      D3Graphics.Pie.render(data.pieChart);
      D3Graphics.Line.render(data.lineChart);
    });

  });
