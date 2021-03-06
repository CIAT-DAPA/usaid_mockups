'use strict';

/**
 * @ngdoc service
 * @name usaidMockupsApp.cultivoFactory
 * @description
 * # cultivoFactory
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
  .factory('cultivoFactory',['$http','config','CSV2Json', function ($http,config,CSV2Json) {    
    var dataFactory = {};

    dataFactory.getUrlDatos = function (cultivo) {
      return cultivo == 'arroz' ? config.data_arroz : config.data_maiz;
    }

    /* Lista todos los registros de un cultivo  */
    dataFactory.listar = function (cultivo) {
      
      var items = $http.get(dataFactory.getUrlDatos(cultivo)).then(function(response){        
        return CSV2Json.parse(response.data);
      });      
      
      return items;
    }

    /* Lista todos los resgistros de un cultivo según su variedad */
    dataFactory.listarPorVariedad = function (cultivo, variedad) {
      
      var items = $http.get(dataFactory.getUrlDatos(cultivo)).then(function(response){        
        return CSV2Json.parse(response.data).filter(function(item){
            return item.Variedad === variedad;
        });
      });      
      
      return items;
    }

    /* Lista todas la variedades de un cultivo */
    dataFactory.listarVariedades = function (cultivo) {
      var variedades = [];
      var items = $http.get(dataFactory.getUrlDatos(cultivo)).then(function(response){        
        var registros = CSV2Json.parse(response.data).filter(function(item){
          if(variedades.indexOf(item.Variedad) < 0){
              variedades.push(item.Variedad);
              return true;
          }
          else
            return false;
            
        });
        return variedades;
      });
      return items;
    }

    /* Obtiene todos los registros de un cultivo en el formato requerido por el calendario */
    dataFactory.listarCalendar = function (cultivo) {
      
      var items = $http.get(config.data_arroz_calendar).then(function(response){        
        return CSV2Json.parse(response.data);
      });      
      
      return items;
    }

    return dataFactory;
  }]);
