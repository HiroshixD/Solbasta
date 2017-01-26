(function () {
  'use strict';
  angular
    .module('categorias.services')
    .factory('CategoriaAuctionService', CategoriaAuctionService);

  CategoriaAuctionService.$inject = ['$http'];

  function CategoriaAuctionService($http) {
    var me = this;
    me.getAuctionByCategorie = function(id, options) {
      $http.get('/api/getauctionforcategorie/' + id)
      .then(options.success, options.error);
    };
    me.getCategoryById = function(id, options) {
      $http.get('/api/categorias/' + id)
      .then(options.success, options.error);
    };


    return {
      getAuctionByCategorie: me.getAuctionByCategorie,
      getCategoryById: me.getCategoryById
    };
  }

}());
