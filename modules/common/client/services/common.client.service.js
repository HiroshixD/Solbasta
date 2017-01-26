(function () {
  'use strict';

  angular
    .module('commons.services')
    .factory('CommonService', CommonService);

  CommonService.$inject = ['$http', '$timeout', '$interval'];

  function CommonService($http, $timeout, $interval) {
    var me = this;
    //  });
    me.duration = function (timeSpan) {
      var horas = new Date(timeSpan).getTime();
      var days = Math.floor(horas / 86400000);
      var diff = horas - days * 86400000;
      var hours = Math.floor(diff / 3600000);
      diff = diff - hours * 3600000;
      var minutes = Math.floor(diff / 60000);
      diff = diff - minutes * 60000;
      var secs = Math.floor(diff / 1000);
      return { 'days': days, 'hours': hours, 'minutes': minutes, 'seconds': secs };
    };
    me.getLocalTime = function(datetime) {
      var localDate = new Date(datetime);
      var localTime = localDate.getTime();
      var localOffset = localDate.getTimezoneOffset() * 60000;
      var reference = new Date(localTime + localOffset);
      var now = moment().utc();
      return moment(reference) - now;
    };
    me.getLocale = function(datetime) {
      var localDate = new Date(datetime);
      var localTime = localDate.getTime();
      var localOffset = localDate.getTimezoneOffset() * 60000;
      return new Date(localTime + localOffset);
    };
    me.twoCharacters = function(character) {
      if (character.toString().length === 1) {
        return '0' + character;
      } else {
        return character;
      }
    };
    me.getServerTime = function(options) {
      $http.get('/api/getservertime')
      .then(options.success, options.error);
    };
    return {
      duration: me.duration,
      getLocalTime: me.getLocalTime,
      getLocale: me.getLocale,
      twoCharacters: me.twoCharacters,
      getServerTime: me.getServerTime
    };
  }
}());
