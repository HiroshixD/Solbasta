(function () {
  'use strict';

  angular
    .module('detalle_subastas')
    .controller('Detalle_subastasListController', Detalle_subastasListController);

  Detalle_subastasListController.$inject = ['Detalle_subastasService', 'CommonService', 'GestionarSubastas', 'Alertify'];

  function Detalle_subastasListController(Detalle_subastasService, CommonService, GestionarSubastas, Alertify) {
    var vm = this;
    vm.detalle_subastas = Detalle_subastasService.query();
    vm.setLocale = function(datetime) {
      return CommonService.getLocalTime(datetime);
    };

    vm.getListOfAuctions = function(type) {
      if (type === 3) {
        vm.terminadas = true;
      }
      vm.data = {
        'status': type
      };
      GestionarSubastas.listForType(vm.data, {
        success: function(response) {
          vm.detalle_subastas = response.data;
        },
        error: function(response) {
          Alertify.error('ocurrio un problema');
        }
      });
    };

    vm.getWinnerData = function(userdataid) {
      vm.data = {
        'userdataid': userdataid
      };

      GestionarSubastas.getWinnerAddress(vm.data, {
        success: function(response) {
          vm.dataUser = response.data;
        },
        error: function(response) {
          alert('ocurrio un error');
        }
      });
    };

    vm.payAndSend = function(id) {
      vm.data = {
        'idsubasta': id
      };
      GestionarSubastas.payAndSend(vm.data, {
        success: function(response) {
          vm.changeStatus(response.data);
        },
        error: function(response) {
          alert('error inesperado');
        }
      });
    };

    vm.changeStatus = function(id) {
      for (var i in vm.detalle_subastas) {
        if (vm.detalle_subastas[i]._id === id) {
          vm.detalle_subastas[i].estado_envio = 1;
          vm.detalle_subastas[i].estado_pago = 1;
        }
      }
    };

    vm.filtrar = function() {
      vm.search = {};
      if (vm.filtro) {
        vm.search.estado_envio = 0;
        return;
      }
      vm.search.estado_envio = 1;
    };

  }
}());
