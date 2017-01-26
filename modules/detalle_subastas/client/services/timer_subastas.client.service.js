(function () {
  'use strict';
  angular
    .module('detalle_subastas.services')
    .factory('TimerService', TimerService);

  TimerService.$inject = ['$http'];

  function TimerService($http) {
    var me = this;
    me.updateTimer = function(idsubasta, data, options) {
      $http.put('/api/detalle_subasta/' + idsubasta, data)
      .then(options.success, options.error);
    };
    return {
      updateTimer: me.updateTimer
    };
  }

}());
