(function () {
  'use strict';

  angular
    .module('tipo_subastas.services')
    .factory('Tipo_subastasService', Tipo_subastasService);

  Tipo_subastasService.$inject = ['$resource'];

  function Tipo_subastasService($resource) {
    var Tipo_subasta = $resource('api/tipo_subastas/:tipo_subastaId', {
      tipo_subastaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Tipo_subasta.prototype, {
      createOrUpdate: function () {
        var tipo_subasta = this;
        return createOrUpdate(tipo_subasta);
      }
    });

    return Tipo_subasta;

    function createOrUpdate(tipo_subasta) {
      if (tipo_subasta._id) {
        return tipo_subasta.$update(onSuccess, onError);
      } else {
        return tipo_subasta.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(tipo_subasta) {
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
