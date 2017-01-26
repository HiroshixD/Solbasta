(function () {
  'use strict';

  angular
    .module('cuentas')
    .controller('AdminCuentasController', AdminCuentasController);

  AdminCuentasController.$inject = ['$scope', 'Cuentas', 'Transacciones', 'Socket'];

  function AdminCuentasController($scope, Cuentas, Transacciones, Socket) {
    var vm = this;

    vm.sendMessage = function(message) {
      Socket.emit('Notifications', message);
    };

    startSocket();

    function startSocket() {
      // Si el usuario no ha iniciado sesion redirecciona a
/*      if (!Authentication.user) {
        $state.go('home');
      }*/

      // Si socket no estÃƒÂ¡ conectado, conectamos
      if (!Socket.socket) {
        Socket.connect();
      }

      // Cuando la instancia del socket es destruida, eliminamos ÃƒÂ©sta
      $scope.$on('$destroy', function () {
        Socket.removeListener('Notifications');
      });
    }

    vm.getUsername = function(username) {
      Cuentas.username(username, {
        success: function(response) {
          vm.users = response.data;
          console.log(response.data);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.banAccount = function(id) {
      Cuentas.banUser(id, {
        success: function(response) {
          vm.updateData(response.data);
          $('#confirmBan').modal('hide');
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.unbanAccount = function(id) {
      Cuentas.unbanUser(id, {
        success: function(response) {
          vm.updateData(response.data);
          $('#confirmUnban').modal('hide');
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.updateData = function(data) {
      for (var i in vm.users) {
        if (vm.users[i]._id === data._id) {
          vm.users.splice(i, 1, data);
          break;
        }
      }
    };

    vm.chargeButton = function(data) {
      vm.users = [];
      vm.users.push(data);
      vm.userid = data._id;
    };

    vm.getModalData = function(data) {
      vm.data = data;
    };

    vm.chargeBalance = function(id) {
      vm.transaction = {
        'tipo_recarga': 'Recarga de saldo manual - Admin a User',
        'soles_transferencia': vm.monto,
        'transaccion_tipo': 'Crédito',
        'estado': 1,
        'tipo': 0,
        'descripcion': vm.descripcion,
        'user': id
      };
      Transacciones.createTransactionBalance(vm.transaction, {
        success: function(response) {
          vm.transactionAccount(response.data._id);
          vm.updateBalance(id, vm.monto);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.updateBalance = function(userid, amount) {
      Cuentas.charge(userid, amount, {
        success: function(response) {
          console.log(response.data);
        }
      });
    };

    vm.transactionAccount = function(id) {
      vm.accountTransaction = {
        'identificador': vm.descripcion,
        'monto': 1,
        'tipo_moneda': 'Soles',
        'tipo_pago': 'Recarga Saldo - Banco/Voucher',
        'transaccion': id
      };
      Transacciones.createTransactionAccount(vm.accountTransaction, {
        success: function(response) {
          $('#modalCharge').modal('hide');
          console.log(response.data);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

  }
}());
