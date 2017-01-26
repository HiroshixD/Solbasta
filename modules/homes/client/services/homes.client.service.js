(function () {
  'use strict';

  angular
    .module('homes.services')
    .factory('HomesService', HomesService);

  HomesService.$inject = ['$resource', '$timeout'];

  function HomesService($resource, $timeout) {
    // INICIO DE EL RESOURCE
    return {
      Home: $resource('api/homes/:homeId', {
        homeId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      })
    };
    //  FIN DEL RESOURCE
  }
}());
