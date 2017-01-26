(function () {
  'use strict';

  angular
    .module('productos.services')
    .factory('SliderService', SliderService);

  SliderService.$inject = ['$http', '$resource'];

  function SliderService($http, $resource) {
    var me = this;

    me.getSliders = function(options) {
      $http.get('/api/getsliders')
      .then(options.success, options.error);
    };
    me.getAuctions = function(options) {
      $http.get('/api/lastfifteen')
      .then(options.success, options.error);
    };
    return {
      getSliders: me.getSliders,
      getAuctions: me.getAuctions
    };

  }
}());
