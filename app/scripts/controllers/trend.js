'use strict';

/**
 * @ngdoc function
 * @name usaidMockupsApp.controller:TrendCtrl
 * @description
 * # TrendCtrl
 * Controller of the usaidMockupsApp
 */
angular.module('usaidMockupsApp')
  .controller('TrendCtrl', function ($scope, $routeParams, cultivoFactory) {
    $scope.tipoCultivo = $routeParams.cultivoID;
    $scope.variedades = [];

    cultivoFactory.listarVariedades($scope.tipoCultivo).then(function (data) {
      $scope.variedades = data;
    });

    $scope.cambiar = function (value) {      
      cultivoFactory.listarPorVariedad($scope.tipoCultivo, value).then(function (data) {
        D3Graphics.Trend.render(data);
      });
    }
  });
