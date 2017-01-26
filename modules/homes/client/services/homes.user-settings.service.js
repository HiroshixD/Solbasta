(function () {
  'use strict';
  angular
    .module('detalle_subastas.services')
    .factory('UserSettingsService', UserSettingsService);

  UserSettingsService.$inject = ['$http'];

  function UserSettingsService($http) {
    var me = this;
    me.modifyUser = function(form, options) {
      $http.put('/api/users/', form)
      .then(options.success, options.error);
    };
    me.createReminder = function(data, options) {
      $http.get('/api/reminders', data)
      .then(options.success, options.error);
    };
    me.getFeatured = function(options) {
      $http.get('/api/featured')
      .then(options.success, options.error);
    };
    me.getUserByReferralCode = function(code, options) {
      $http.get('/api/getuserbycode/' + code)
      .then(options.success, options.error);
    };
    me.manageSuscriptions = function(options) {
      $http.post('/api/managesuscription')
      .then(options.success, options.error);
    };
    me.getRemindersByUser = function(id, options) {
      $http.get('/api/remindersbyuser/' + id)
      .then(options.success, options.error);
    };
    me.removeReminderById = function(data, options) {
      $http.post('/api/removereminderforid', data)
      .then(options.success, options.error);
    };
    return {
      modifyUser: me.modifyUser,
      createReminder: me.createReminder,
      getFeatured: me.getFeatured,
      getUserByReferralCode: me.getUserByReferralCode,
      manageSuscriptions: me.manageSuscriptions,
      getRemindersByUser: me.getRemindersByUser,
      removeReminderById: me.removeReminderById
    };
  }

}());
