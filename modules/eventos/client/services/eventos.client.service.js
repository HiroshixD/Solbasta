(function () {
  'use strict';

  angular
    .module('eventos.services')
    .factory('EventosService', EventosService);

  EventosService.$inject = ['$resource'];

  function EventosService($resource) {
    var Evento = $resource('api/eventos/:eventoId', {
      eventoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Evento.prototype, {
      createOrUpdate: function () {
        var evento = this;
        return createOrUpdate(evento);
      }
    });

    return Evento;

    function createOrUpdate(evento) {
    //	Recupera los datos del controlador, si existe un id de por medio hace update
      if (evento._id) {
        return evento.$update(onSuccess, onError);
      } else {
        return evento.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(evento) {
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
