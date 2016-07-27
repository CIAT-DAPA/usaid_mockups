'use strict';

/**
 * @ngdoc function
 * @name usaidMockupsApp.controller:CultivoCtrl
 * @description
 * # CultivoCtrl
 * Controller of the usaidMockupsApp
 */
angular.module('usaidMockupsApp')
  .controller('CultivoCtrl', function ($scope, $routeParams, cultivoFactory) {

    $scope.tipoCultivo = $routeParams.cultivoID;
    $scope.items = [];
    cultivoFactory.listar($scope.tipoCultivo).then(function (data) {
      $scope.items = data;
    });
  });
