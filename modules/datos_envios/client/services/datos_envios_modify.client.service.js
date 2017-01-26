(function () {
  'use strict';
  angular
    .module('detalle_subastas.services')
    .factory('DireccionesService', DireccionesService);

  DireccionesService.$inject = ['$http'];

  function DireccionesService($http) {
    var me = this;
    me.modifyAddress = function(id, form, options) {
      $http.put('/api/datos_envios/' + id, form)
      .then(options.success, options.error);
    };
    return {
      modifyAddress: me.modifyAddress
    };
  }

}());
