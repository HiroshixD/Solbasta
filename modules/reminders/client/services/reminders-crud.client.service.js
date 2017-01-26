(function () {
  'use strict';
  angular
    .module('reminders.services')
    .factory('ReminderCrud', ReminderCrud);

  ReminderCrud.$inject = ['$http'];

  function ReminderCrud($http) {
    var me = this;
    me.createReminder = function(data, options) {
      $http.post('/api/reminders', data)
      .then(options.success, options.error);
    };
    me.getReminderByAuction = function(auctionid, userid, options) {
      $http.get('/api/reminder/' + auctionid + '/' + userid)
      .then(options.success, options.error);
    };
    me.deleteReminder = function(auctionid, userid, options) {
      $http.get('/api/removereminder/' + auctionid + '/' + userid)
      .then(options.success, options.error);
    };

    return {
      createReminder: me.createReminder,
      getReminderByAuction: me.getReminderByAuction,
      deleteReminder: me.deleteReminder
    };
  }

}());
