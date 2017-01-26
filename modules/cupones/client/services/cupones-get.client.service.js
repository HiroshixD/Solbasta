(function () {
  'use strict';
  angular
    .module('cupones.services')
    .factory('GestionarCupones', GestionarCupones);

  GestionarCupones.$inject = ['$http'];

  function GestionarCupones($http) {
    var me = this;
    me.getCouponInfo = function(data, options) {
      $http.post('/api/cupon', data)
      .then(options.success, options.error);
    };
    me.updateCouponStatus = function(codigo, data, options) {
      $http.put('/api/cupones/' + codigo, data)
      .then(options.success, options.error);
    };

    return {
      getCouponInfo: me.getCouponInfo,
      updateCouponStatus: me.updateCouponStatus
    };
  }

}());
