(function () {
  'use strict';

  angular
    .module('contactos.services')
    .factory('ContactosService', ContactosService);

  ContactosService.$inject = ['$resource'];

  function ContactosService($resource) {
    var Contacto = $resource('api/contactos/:contactoId', {
      contactoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Contacto.prototype, {
      createOrUpdate: function () {
        var contacto = this;
        return createOrUpdate(contacto);
      }
    });

    return Contacto;

    function createOrUpdate(contacto) {
    //	Recupera los datos del controlador, si existe un id de por medio hace update
      if (contacto._id) {
        return contacto.$update(onSuccess, onError);
      } else {
        return contacto.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(contacto) {
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
