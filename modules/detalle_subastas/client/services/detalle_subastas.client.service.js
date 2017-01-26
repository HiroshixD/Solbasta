(function () {
  'use strict';

  angular
    .module('detalle_subastas.services')
    .factory('Detalle_subastasService', Detalle_subastasService);

  Detalle_subastasService.$inject = ['$resource'];

  function Detalle_subastasService($resource) {
    var Detalle_subasta = $resource('api/detalle_subastas/:detalle_subastaId', {
      detalle_subastaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Detalle_subasta.prototype, {
      createOrUpdate: function () {
        var detalle_subasta = this;
        return createOrUpdate(detalle_subasta);
      }
    });

    return Detalle_subasta;

    function createOrUpdate(detalle_subasta) {
      if (detalle_subasta._id) {
        return detalle_subasta.$update(onSuccess, onError);
      } else {
        return detalle_subasta.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(detalle_subasta) {
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
