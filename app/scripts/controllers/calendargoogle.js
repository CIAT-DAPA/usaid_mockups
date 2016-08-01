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
    cultivoFactory.listar($scope.tipoCultivo).then(function (data) { 
      D3Graphics.CalendarGoogle.render(data);
    });
  });
