'use strict';

/**
 * @ngdoc function
 * @name usaidMockupsApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the usaidMockupsApp
 */
angular.module('usaidMockupsApp')
  .controller('DashboardCtrl', function (climaFactory) {
    climaFactory.listarDashboard().then(function (data) {
      D3Graphics.Dashboard.render(data);
    });


  });
