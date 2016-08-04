'use strict';

/**
 * @ngdoc function
 * @name usaidMockupsApp.controller:SpiderCtrl
 * @description
 * # SpiderCtrl
 * Controller of the usaidMockupsApp
 */
angular.module('usaidMockupsApp')
  .controller('SpiderCtrl', function ($scope, $routeParams, cultivoFactory) {
    $scope.tipoCultivo = $routeParams.cultivoID;
    cultivoFactory.listar($scope.tipoCultivo).then(function (data) {
      var spider = D3Graphics.Spider;
      //Data
      var d = [];
      var variedades = [];
      var valores = [];
      for (var i = 0; i < data.length; i++) {
        if (variedades.indexOf(data[i].Variedad) < 0){
          var variedad = data[i].Variedad;
          valores = [];
          variedades.push(variedad);
          for (var j = 0; j < data.length; j++) {
            if(data[j].Variedad == variedad){
              valores.push({ axis: data[j].Fecha , value: data[j].RendimientoPromedio });
            }
          }
          d.push(valores);
        }
          
      }
      spider.render(d);
    });


  });
