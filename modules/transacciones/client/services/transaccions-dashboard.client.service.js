(function () {
  'use strict';
  angular
    .module('transaccions.services')
    .factory('Transacciones', Transacciones);

  Transacciones.$inject = ['$http'];

  function Transacciones($http) {
    var me = this;
    me.createTransaction = function(data, options) {
      $http.post('/api/transaccions/', data)
      .then(options.success, options.error);
    };
    me.createTransactionBalance = function(data, options) {
      $http.post('/api/transaccion_saldos/', data)
      .then(options.success, options.error);
    };
    me.getTransactionsForAuction = function(idauction, options) {
      $http.get('/api/transaccionsbyid/' + idauction)
      .then(options.success, options.error);
    };
    me.createTransactionAccount = function(data, options) {
      $http.post('/api/transaccion_cuentas', data)
      .then(options.success, options.error);
    };
    me.getActualStatus = function(tx, options) {
      $http.get('/api/transaccionstatus/' + tx)
      .then(options.success, options.error);
    };
    me.getAllBalanceTransactions = function(iduser, options) {
      $http.get('/api/transaccion_saldos_user/' + iduser)
      .then(options.success, options.error);
    };
    return {
      createTransaction: me.createTransaction,
      getTransactionsForAuction: me.getTransactionsForAuction,
      createTransactionBalance: me.createTransactionBalance,
      createTransactionAccount: me.createTransactionAccount,
      getActualStatus: me.getActualStatus,
      getAllBalanceTransactions: me.getAllBalanceTransactions
    };
  }

}());
