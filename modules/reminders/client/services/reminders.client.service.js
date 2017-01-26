(function () {
  'use strict';

  angular
    .module('reminders.services')
    .factory('RemindersService', RemindersService);

  RemindersService.$inject = ['$resource'];

  function RemindersService($resource) {
    var Reminder = $resource('api/reminders/:reminderId', {
      reminderId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Reminder.prototype, {
      createOrUpdate: function () {
        var reminder = this;
        return createOrUpdate(reminder);
      }
    });

    return Reminder;

    function createOrUpdate(reminder) {
    //	Recupera los datos del controlador, si existe un id de por medio hace update
      if (reminder._id) {
        return reminder.$update(onSuccess, onError);
      } else {
        return reminder.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(reminder) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      //  console.log(error);
    }
  }
}());
