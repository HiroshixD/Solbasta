(function () {
  'use strict';

  angular
    .module('productos.services')
    .factory('ProductosService', ProductosService);

  ProductosService.$inject = ['$http', '$resource'];

  function ProductosService($http, $resource) {
    var Producto = $resource('api/productos/:productoId', {
      productoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Producto.prototype, {
      createOrUpdate: function () {
        var producto = this;
        return createOrUpdate(producto);
      }
    });

    return Producto;

    function createOrUpdate(producto) {
      if (producto._id) {
        return producto.$update(onSuccess, onError);
      } else {
        return producto.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(producto) {
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
