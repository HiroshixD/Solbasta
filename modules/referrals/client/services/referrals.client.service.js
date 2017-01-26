(function () {
  'use strict';

  angular
    .module('referrals.services')
    .factory('ReferralsService', ReferralsService);

  ReferralsService.$inject = ['$resource'];

  function ReferralsService($resource) {
    var Referral = $resource('api/referrals/:referralId', {
      referralId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Referral.prototype, {
      createOrUpdate: function () {
        var referral = this;
        return createOrUpdate(referral);
      }
    });

    return Referral;

    function createOrUpdate(referral) {
    //	Recupera los datos del controlador, si existe un id de por medio hace update
      if (referral._id) {
        return referral.$update(onSuccess, onError);
      } else {
        return referral.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(referral) {
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
