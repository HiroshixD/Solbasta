(function () {
  'use strict';

  angular
    .module('homes')
    .controller('ReferralController', ReferralController);

  ReferralController.$inject = ['$rootScope', '$scope', '$state', '$window', 'Authentication', '$timeout', 'ReferralsUsersService'];

  function ReferralController($rootScope, $scope, $state, $window, Authentication, $timeout, ReferralsUsersService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.userSession = JSON.parse(localStorage.getItem("userSession"));
    vm.referralcode = vm.userSession.referral_code;

    vm.getReferrals = function(code) {
      ReferralsUsersService.getReferrals(code, {
        success: function(response) {
          vm.referrals = response.data;
          console.log('aqui tus referidos');
          console.log(response.data);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.getReferrals(vm.referralcode);
  }
}());
