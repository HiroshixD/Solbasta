(function () {
  'use strict';

  angular
    .module('commons.services')
    .filter('startFrom', startFrom);

  startFrom.$inject = [];

  function startFrom() {
    return function(input, start) {
      if (input === undefined) {
        return;
      }
      start = +start;
      return input.slice(start);
    };
  }

}());
