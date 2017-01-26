(function () {
  'use strict';

  angular
    .module('categorias.services')
    .factory('CategoriasService', CategoriasService);

  CategoriasService.$inject = ['$resource'];

  function CategoriasService($resource) {
    var Categoria = $resource('api/categorias/:categoriaId', {
      categoriaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Categoria.prototype, {
      createOrUpdate: function () {
        var categoria = this;
        return createOrUpdate(categoria);
      }
    });

    return Categoria;

    function createOrUpdate(categoria) {
      if (categoria._id) {
        return categoria.$update(onSuccess, onError);
      } else {
        return categoria.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(categoria) {
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
