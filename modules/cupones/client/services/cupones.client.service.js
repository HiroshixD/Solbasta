(function () {
  'use strict';

  angular
    .module('cupones.services')
    .factory('CuponesService', CuponesService);

  CuponesService.$inject = ['$resource'];

  function CuponesService($resource) {
    var Cupon = $resource('api/cupones/:cuponId', {
      cuponId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Cupon.prototype, {
      createOrUpdate: function () {
        var cupon = this;
        return createOrUpdate(cupon);
      }
    });

    return Cupon;

    function createOrUpdate(cupon) {
    //	Recupera los datos del controlador, si existe un id de por medio hace update
      if (cupon._id) {
        return cupon.$update(onSuccess, onError);
      } else {
        return cupon.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(cupon) {
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
