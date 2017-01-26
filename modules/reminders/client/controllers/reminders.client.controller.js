(function () {
  'use strict';

  angular
    .module('reminders')
    .controller('RemindersController', RemindersController);

  RemindersController.$inject = ['$scope', '$state', 'reminderResolve', '$window', 'Authentication'];

  function RemindersController($scope, $state, reminder, $window, Authentication) {
    var vm = this;

    vm.reminder = reminder;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Reminder
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.reminder.$remove($state.go('reminders.list'));
      }
    }

    // Save Reminder
    function save(isValid) {
    // Si no es válido mostrar el error
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.reminderForm');
        return false;
      }

      // Si el formulario es válido llama al servicio vm.reminder
      vm.reminder.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('reminders.view', {
          reminderId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
