(function () {
  'use strict';
  angular
    .module('cuentas.services')
    .factory('Cuentas', Cuentas);

  Cuentas.$inject = ['$http'];

  function Cuentas($http) {
    var me = this;
    me.updateBalance = function(id, options) {
      $http.put('/api/saldo/' + id)
      .then(options.success, options.error);
    };
    me.charge = function(id, amount, options) {
      $http.put('/api/charge/' + id + '/' + amount)
      .then(options.success, options.error);
    };
    me.username = function(text, options) {
      $http.get('/api/getusernames/' + text)
      .then(options.success, options.error);
    };
    me.banUser = function(id, options) {
      $http.put('/api/banusers/' + id)
      .then(options.success, options.error);
    };
    me.unbanUser = function(id, options) {
      $http.put('/api/unbanusers/' + id)
      .then(options.success, options.error);
    };
    return {
      updateBalance: me.updateBalance,
      charge: me.charge,
      username: me.username,
      banUser: me.banUser,
      unbanUser: me.unbanUser
    };
  }

}());
