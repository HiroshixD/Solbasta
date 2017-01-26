(function () {
  'use strict';

  angular
    .module('referrals')
    .controller('ReferralsListController', ReferralsListController);

  ReferralsListController.$inject = ['ReferralsService'];

  function ReferralsListController(ReferralsService) {
    var vm = this;

    vm.referrals = ReferralsService.query();
  }
}());
