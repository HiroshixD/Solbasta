(function () {
  'use strict';

  angular
    .module('transaccion_cuentas.services')
    .factory('Transaccion_cuentasService', Transaccion_cuentasService);

  Transaccion_cuentasService.$inject = ['$resource'];

  function Transaccion_cuentasService($resource) {
    var Transaccion_cuenta = $resource('api/transaccion_cuentas/:transaccion_cuentaId', {
      transaccion_cuentaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Transaccion_cuenta.prototype, {
      createOrUpdate: function () {
        var transaccion_cuenta = this;
        return createOrUpdate(transaccion_cuenta);
      }
    });

    return Transaccion_cuenta;

    function createOrUpdate(transaccion_cuenta) {
    //	Recupera los datos del controlador, si existe un id de por medio hace update
      if (transaccion_cuenta._id) {
        return transaccion_cuenta.$update(onSuccess, onError);
      } else {
        return transaccion_cuenta.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(transaccion_cuenta) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      //  console.log(error);
    }
  }
}());
