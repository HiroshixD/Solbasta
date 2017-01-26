(function () {
  'use strict';

  angular
    .module('datos_envios.services')
    .factory('Datos_enviosService', Datos_enviosService);

  Datos_enviosService.$inject = ['$resource'];

  function Datos_enviosService($resource) {
    var Datos_envio = $resource('api/datos_envios/:datos_envioId', {
      datos_envioId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Datos_envio.prototype, {
      createOrUpdate: function () {
        var datos_envio = this;
        return createOrUpdate(datos_envio);
      }
    });

    return Datos_envio;

    function createOrUpdate(datos_envio) {
    //	Recupera los datos del controlador, si existe un id de por medio hace update
      if (datos_envio._id) {
        return datos_envio.$update(onSuccess, onError);
      } else {
        return datos_envio.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(datos_envio) {
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
