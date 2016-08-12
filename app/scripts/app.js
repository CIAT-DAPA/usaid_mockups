'use strict';

/**
 * @ngdoc overview
 * @name usaidMockupsApp
 * @description
 * # usaidMockupsApp
 *
 * Main module of the application.
 */
angular
  .module('usaidMockupsApp', [
    'ngAnimate',
    'ngCookies',
    'ngRoute'
  ])
  .value('config',{
      data_clima: 'data/clima/clima.csv',
      data_arroz: 'data/cultivo/arroz.csv',
      data_maiz: 'data/cultivo/maiz.csv',
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/clima', {
        templateUrl: 'views/clima.html',
        controller: 'ClimaCtrl',
        controllerAs: 'clima'
      })
      .when('/cultivo/:cultivoID', {
        templateUrl: 'views/cultivo.html',
        controller: 'CultivoCtrl',
        controllerAs: 'cultivo'
      })
      .when('/graficas/calendarheatmap/:cultivoID/', {
        templateUrl: 'views/calendarheatmap.html',
        controller: 'CalendarheatmapCtrl',
        controllerAs: 'calendarheatmap'
      })
      .when('/graficas/calendargoogle/:cultivoID/', {
        templateUrl: 'views/calendargoogle.html',
        controller: 'CalendargoogleCtrl',
        controllerAs: 'calendargoogle'
      })
      .when('/graficas/spider/:cultivoID/', {
        templateUrl: 'views/spider.html',
        controller: 'SpiderCtrl',
        controllerAs: 'spider'
      })
      .when('/graficas/barchart/:cultivoID/', {
        templateUrl: 'views/barchart.html',
        controller: 'BarchartCtrl',
        controllerAs: 'barchart'
      })
      .when('/graficas/pieandline/clima/', {
        templateUrl: 'views/pieandline.html',
        controller: 'PieandlineCtrl',
        controllerAs: 'pieandline'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
