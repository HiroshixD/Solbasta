(function () {
  'use strict';

  angular
    .module('transaccions.services')
    .factory('TransaccionsService', TransaccionsService);

  TransaccionsService.$inject = ['$resource'];

  function TransaccionsService($resource) {
    var Transaccion = $resource('api/transaccions/:transaccionId', {
      transaccionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Transaccion.prototype, {
      createOrUpdate: function () {
        var transaccion = this;
        return createOrUpdate(transaccion);
      }
    });

    return Transaccion;

    function createOrUpdate(transaccion) {
    //	Recupera los datos del controlador, si existe un id de por medio hace update
      if (transaccion._id) {
        return transaccion.$update(onSuccess, onError);
      } else {
        return transaccion.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(transaccion) {
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
