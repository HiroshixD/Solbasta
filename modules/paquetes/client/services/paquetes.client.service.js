(function () {
  'use strict';

  angular
    .module('paquetes.services')
    .factory('PaquetesService', PaquetesService);

  PaquetesService.$inject = ['$resource'];

  function PaquetesService($resource) {
    var Paquete = $resource('api/paquetes/:paqueteId', {
      paqueteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Paquete.prototype, {
      createOrUpdate: function () {
        var paquete = this;
        return createOrUpdate(paquete);
      }
    });

    return Paquete;

    function createOrUpdate(paquete) {
    //	Recupera los datos del controlador, si existe un id de por medio hace update
      if (paquete._id) {
        return paquete.$update(onSuccess, onError);
      } else {
        return paquete.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(paquete) {
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
