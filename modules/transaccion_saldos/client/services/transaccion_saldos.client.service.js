(function () {
  'use strict';

  angular
    .module('transaccion_saldos.services')
    .factory('Transaccion_saldosService', Transaccion_saldosService);

  Transaccion_saldosService.$inject = ['$resource'];

  function Transaccion_saldosService($resource) {
    var Transaccion_saldo = $resource('api/transaccion_saldos/:transaccion_saldoId', {
      transaccion_saldoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Transaccion_saldo.prototype, {
      createOrUpdate: function () {
        var transaccion_saldo = this;
        return createOrUpdate(transaccion_saldo);
      }
    });

    return Transaccion_saldo;

    function createOrUpdate(transaccion_saldo) {
    //	Recupera los datos del controlador, si existe un id de por medio hace update
      if (transaccion_saldo._id) {
        return transaccion_saldo.$update(onSuccess, onError);
      } else {
        return transaccion_saldo.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(transaccion_saldo) {
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
