'use strict';

/**
 * @ngdoc function
 * @name usaidMockupsApp.controller:BarchartCtrl
 * @description
 * # BarchartCtrl
 * Controller of the usaidMockupsApp
 */
angular.module('usaidMockupsApp')
  .controller('BarchartCtrl', function ($scope, $routeParams, cultivoFactory) {
    $scope.tipoCultivo = $routeParams.cultivoID;
    cultivoFactory.listar($scope.tipoCultivo).then(function (data) { 
      D3Graphics.Barchart.render(data);
    });
  });
