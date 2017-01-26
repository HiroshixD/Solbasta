(function () {
  'use strict';

  angular
    .module('commons.services')
    .filter('CommonFilter', CommonFilter);

  CommonFilter.$inject = ['CommonService'];

  function CommonFilter(CommonService) {
    return function (input, css) {
      var service = CommonService;
      var duration = service.duration(input);
      if ((input / 1000) < 86400) {
        return service.twoCharacters(duration.hours) + ':' + service.twoCharacters(duration.minutes) + ':' + service.twoCharacters(duration.seconds);
      } else if ((input / 1000) < 86400) {
        return duration.days + 'días ' + service.twoCharacters(duration.hours) + ':' + service.twoCharacters(duration.minutes) + ':' + service.twoCharacters(duration.seconds);
      } else if ((input / 1000) > 86400) {
        return duration.days + 'días ' + service.twoCharacters(duration.hours) + ':' + service.twoCharacters(duration.minutes) + ':' + service.twoCharacters(duration.seconds);
      } else {
        return 'cargando...';
      }
    };
  }

}());
