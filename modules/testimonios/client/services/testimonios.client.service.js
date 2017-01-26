(function () {
  'use strict';

  angular
    .module('testimonios.services')
    .factory('TestimoniosService', TestimoniosService);

  TestimoniosService.$inject = ['$resource'];

  function TestimoniosService($resource) {
    var Testimonio = $resource('api/testimonios/:testimonioId', {
      testimonioId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Testimonio.prototype, {
      createOrUpdate: function () {
        var testimonio = this;
        return createOrUpdate(testimonio);
      }
    });

    return Testimonio;

    function createOrUpdate(testimonio) {
    //	Recupera los datos del controlador, si existe un id de por medio hace update
      if (testimonio._id) {
        return testimonio.$update(onSuccess, onError);
      } else {
        return testimonio.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(testimonio) {
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
