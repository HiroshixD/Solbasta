(function () {
  'use strict';

  angular
    .module('cuentas.services')
    .factory('CuentasService', CuentasService);

  CuentasService.$inject = ['$resource'];

  function CuentasService($resource) {
    var Cuenta = $resource('api/cuentas/:cuentaId', {
      cuentaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
    return Cuenta;
  }
}());
