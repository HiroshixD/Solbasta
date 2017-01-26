(function () {
  'use strict';

  angular
    .module('referrals.services')
    .factory('ReferralsUsersService', ReferralsUsersService);

  ReferralsUsersService.$inject = ['$resource', '$http'];

  function ReferralsUsersService($resource, $http) {
    var me = this;
    me.getReferrals = function(code, options) {
      $http.get('/api/getreferrals/' + code)
      .then(options.success, options.error);
    };
    me.getReferralById = function(id, options) {
      $http.get('/api/referrals/' + id)
      .then(options.success, options.error);
    };
    me.updateReferralStatus = function(id, data, options) {
      $http.put('/api/referrals/' + id, data)
      .then(options.success, options.error);
    };
    return {
      getReferrals: me.getReferrals,
      getReferralById: me.getReferralById,
      updateReferralStatus: me.updateReferralStatus
    };

  }
}());
