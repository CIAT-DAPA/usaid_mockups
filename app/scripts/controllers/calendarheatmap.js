'use strict';

/**
 * @ngdoc function
 * @name usaidMockupsApp.controller:CalendarheatmapCtrl
 * @description
 * # CalendarheatmapCtrl
 * Controller of the usaidMockupsApp
 */
angular.module('usaidMockupsApp')
  .controller('CalendarheatmapCtrl', function ($scope, $routeParams, $compile, cultivoFactory) {

    $scope.tipoCultivo = $routeParams.cultivoID;
    $scope.variedades=[];
    cultivoFactory.listar($scope.tipoCultivo).then(function (data) {

      var variedades = [];
      for (var i = 0; i < data.length; i++) {        
        if (variedades.indexOf(data[i].Variedad) < 0){
          $("#chart").html($("#chart").html() +'<h3>' + data[i].Variedad + '</h3><div id="chart' + data[i].Variedad  + '" class="clearfix"></div>');
          variedades.push(data[i].Variedad);
        }
          
      }

      for (var i = 0; i < variedades.length; i++) {
        var calendar = D3Graphics.CalendarHeatmap;
        calendar.vars.container = '#chart' + variedades[i];

        calendar.render(data.filter(function (item) {
          return item.Variedad == variedades[i];
        }));

      }

    });




  });

