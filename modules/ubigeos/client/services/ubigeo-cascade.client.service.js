(function () {
  'use strict';

  angular
    .module('ubigeos.services')
    .factory('UbigeosCascadeService', UbigeosCascadeService);

  UbigeosCascadeService.$inject = ['$http'];

  function UbigeosCascadeService($http) {
    var me = this;

    me.getDepartamentos = function (options) {
      $http.get('/api/departamentos')
      .then(options.success, options.error);
    };

    me.getProvincias = function(departamento, options) {
      $http.get('/api/provincias/' + departamento)
      .then(options.success, options.error);
    };

    me.getDistritos = function(provincia, options) {
      $http.get('/api/distritos/' + provincia)
      .then(options.success, options.error);
    };

    return {
      getDepartamentos: me.getDepartamentos,
      getProvincias: me.getProvincias,
      getDistritos: me.getDistritos
    };

  }
}());
