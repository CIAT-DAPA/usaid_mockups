'use strict';

/**
 * @ngdoc service
 * @name usaidMockupsApp.climaFactory
 * @description
 * # climaFactory
 * Factory in the usaidMockupsApp.
 */
angular.module('usaidMockupsApp')
  .factory('CSV2Json',function () {
    // Service logic
    // ...

    var dataFactory = {};

    dataFactory.parse = function (csv) {
      var lines=csv.split("\n");
      var result = [];
      var headers=lines[0].split(",");
      for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split(",");
        for(var j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
      }
      return result; 
      //return JSON.parse(JSON.stringify(result)) ; //JSON
    }

    return dataFactory;
  })
  .factory('climaFactory',['$http','config','CSV2Json', function ($http,config,CSV2Json) {    
    var dataFactory = {};

    dataFactory.getUrlDatos = function () {
      return config.data_clima;
    }

    dataFactory.listar = function () {
      
      var items = $http.get(dataFactory.getUrlDatos()).then(function(response){        
        return response.data;
      });      
      
      return items;
    }

    return dataFactory;
  }]);
