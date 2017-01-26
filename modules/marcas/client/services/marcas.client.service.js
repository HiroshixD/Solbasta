(function () {
  'use strict';

  angular
    .module('marcas.services')
    .factory('MarcasService', MarcasService);

  MarcasService.$inject = ['$resource'];

  function MarcasService($resource) {
    var Marca = $resource('api/marcas/:marcaId', {
      marcaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Marca.prototype, {
      createOrUpdate: function () {
        var marca = this;
        return createOrUpdate(marca);
      }
    });

    return Marca;

    function createOrUpdate(marca) {
      if (marca._id) {
        return marca.$update(onSuccess, onError);
      } else {
        return marca.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(marca) {
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
