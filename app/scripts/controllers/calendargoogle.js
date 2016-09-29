'use strict';

/**
 * @ngdoc function
 * @name usaidMockupsApp.controller:CalendargoogleCtrl
 * @description
 * # CalendargoogleCtrl
 * Controller of the usaidMockupsApp
 */
angular.module('usaidMockupsApp')
  .controller('CalendargoogleCtrl', function ($scope, $routeParams, cultivoFactory) {
    $scope.tipoCultivo = $routeParams.cultivoID;
    $scope.variedades = [];

    cultivoFactory.listarVariedades($scope.tipoCultivo).then(function (data) {
      $scope.variedades = data;
    });

    $scope.cambiar = function (value) {
      cultivoFactory.listarPorVariedad($scope.tipoCultivo, value).then(function (data) {
        D3Graphics.CalendarGoogle.render(data);
      });
    }
  });
