(function () {
  'use strict';

  angular
    .module('commons.services')
    .filter('trusted', trusted);

  trusted.$inject = ['$sce'];

  function trusted($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  }

}());
