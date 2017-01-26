(function () {
  'use strict';

  angular
    .module('homes')
    .controller('HomeContactController', HomeContactController);

  HomeContactController.$inject = ['$rootScope', '$scope', '$state', '$window', 'Authentication', '$timeout', 'ContactClientService', 'Alertify'];

  function HomeContactController($rootScope, $scope, $state, $window, Authentication, $timeout, ContactClientService, Alertify) {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    var vm = this;
    vm.authentication = Authentication;
    $rootScope.bodyClass = 'marfil';
    vm.message = 'Envienme otro correo';
    vm.sendMail = function() {
      vm.message = 'Reenviado';
    };
    vm.contacto = {};

    vm.changeBodyStyle = function(style) {
      $rootScope.bodyClass = style;
    };

    vm.createContact = function() {
      ContactClientService.createContact(vm.contacto, {
        success: function(response) {
          Alertify.success('TU MENSAJE NOS HA LLEGADO CORRECTAMENTE, GRACIAS POR COMUNICARTE CON NOSOTROS');
        },
        error: function(response) {
          Alertify.error(response.data.message);
        }
      });
    };

  }
}());
