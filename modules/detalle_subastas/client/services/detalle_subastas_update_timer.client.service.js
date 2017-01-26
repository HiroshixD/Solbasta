(function () {
  'use strict';
  angular
    .module('detalle_subastas.services')
    .factory('GestionarSubastas', GestionarSubastas);

  GestionarSubastas.$inject = ['$http'];

  function GestionarSubastas($http) {
    var me = this;
    me.getForType = function(id, options) {
      $http.get('/api/auctions/process/' + id)
      .then(options.success, options.error);
    };
    me.getFiveForType = function(id, options) {
      $http.get('/api/auctions/fiveprocess/' + id)
      .then(options.success, options.error);
    };
    me.modifyType = function(id, estado, options) {
      var body = { 'estado': estado
      };
      $http.put('api/detalle_subasta_tipo/' + id, body);
    };
    me.getWinners = function(id, options) {
      $http.get('/api/auctionswon/' + id)
      .then(options.success, options.error);
    };
    me.getNext = function(options) {
      $http.get('/api/getnext')
      .then(options.success, options.error);
    };
    me.getNext5 = function(options) {
      $http.get('/api/getnext5')
      .then(options.success, options.error);
    };
    me.getThreeMonths = function(options) {
      $http.get('/api/subastas_month/threemonths')
      .then(options.success, options.error);
    };
    me.getSixMonths = function(options) {
      $http.get('/api/subastas_month/sixmonths')
      .then(options.success, options.error);
    };
    me.getAuctionsForText = function(text, options) {
      $http.get('/api/search/' + text)
      .then(options.success, options.error);
    };
    me.listForType = function(type, options) {
      $http.post('/api/listfortype', type)
      .then(options.success, options.error);
    };
    me.getWinnerData = function(data, options) {
      $http.post('/api/datawinner', data)
      .then(options.success, options.error);
    };
    me.getWinnerAddress = function(data, options) {
      $http.post('/api/getalladresses', data)
      .then(options.success, options.error);
    };
    me.payAndSend = function(data, options) {
      $http.post('/api/payandsend', data)
      .then(options.success, options.error);
    };
    me.getWinnersSkipped = function(data, options) {
      $http.post('/api/auctionswonskip', data)
      .then(options.success, options.error);
    };

    return {
      getForType: me.getForType,
      modifyType: me.modifyType,
      getWinners: me.getWinners,
      getNext: me.getNext,
      getThreeMonths: me.getThreeMonths,
      getSixMonths: me.getSixMonths,
      getAuctionsForText: me.getAuctionsForText,
      getFiveForType: me.getFiveForType,
      listForType: me.listForType,
      getWinnerData: me.getWinnerData,
      getWinnerAddress: me.getWinnerAddress,
      payAndSend: me.payAndSend,
      getWinnersSkipped: me.getWinnersSkipped,
      getNext5: me.getNext5
    };
  }

}());
