'use strict';

/**
 * @ngdoc service
 * @name usaidMockupsApp.climaFactory
 * @description
 * # climaFactory
 * Factory in the usaidMockupsApp.
 */
angular.module('usaidMockupsApp')
  .factory('climaFactory', function () {
    // Service logic
    // ...

    var estacion = '';
    var fecha = '';
    var bajo = 0.0;
    var normal = 0.0;
    var alto = 0.0;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
