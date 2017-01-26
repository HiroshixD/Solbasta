(function () {
  'use strict';

  angular
    .module('referrals')
    .controller('ReferralsController', ReferralsController);

  ReferralsController.$inject = ['$scope', '$state', 'referralResolve', '$window', 'Authentication'];

  function ReferralsController($scope, $state, referral, $window, Authentication) {
    var vm = this;

    vm.referral = referral;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Referral
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.referral.$remove($state.go('referrals.list'));
      }
    }

    // Save Referral
    function save(isValid) {
    // Si no es válido mostrar el error
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.referralForm');
        return false;
      }

      // Si el formulario es válido llama al servicio vm.referral
      vm.referral.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('referrals.view', {
          referralId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
