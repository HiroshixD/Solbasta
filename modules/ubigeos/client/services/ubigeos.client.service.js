(function () {
  'use strict';

  angular
    .module('ubigeos.services')
    .factory('UbigeosService', UbigeosService);

  UbigeosService.$inject = ['$resource'];

  function UbigeosService($resource) {
    var Ubigeo = $resource('api/ubigeos/:ubigeoId', {
      ubigeoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Ubigeo.prototype, {
      createOrUpdate: function () {
        var ubigeo = this;
        return createOrUpdate(ubigeo);
      }
    });

    return Ubigeo;

    function createOrUpdate(ubigeo) {
      if (ubigeo._id) {
        return ubigeo.$update(onSuccess, onError);
      } else {
        return ubigeo.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(ubigeo) {
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
