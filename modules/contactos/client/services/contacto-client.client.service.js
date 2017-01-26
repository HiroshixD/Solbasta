(function () {
  'use strict';
  angular
    .module('contactos.services')
    .factory('ContactClientService', ContactClientService);

  ContactClientService.$inject = ['$http'];

  function ContactClientService($http) {
    var me = this;
    me.createContact = function(data, options) {
      $http.post('/api/contactos', data)
      .then(options.success, options.error);
    };

    return {
      createContact: me.createContact
    };
  }

}());
