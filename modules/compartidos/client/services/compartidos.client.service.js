(function () {
  'use strict';

  angular
    .module('compartidos.services')
    .factory('CompartidosService', CompartidosService);

  CompartidosService.$inject = ['$resource'];

  function CompartidosService($resource) {
    var Compartido = $resource('api/compartidos/:compartidoId', {
      compartidoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Compartido.prototype, {
      createOrUpdate: function () {
        var compartido = this;
        return createOrUpdate(compartido);
      }
    });

    return Compartido;

    function createOrUpdate(compartido) {
    //	Recupera los datos del controlador, si existe un id de por medio hace update
      if (compartido._id) {
        return compartido.$update(onSuccess, onError);
      } else {
        return compartido.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(compartido) {
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
