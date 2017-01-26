(function () {
  'use strict';

  angular
    .module('homes')
    .controller('HomeChargeController', HomeChargeController);

  HomeChargeController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'GestionarCupones', 'Alertify', 'Transacciones', 'Cuentas'];

  function HomeChargeController($scope, $state, $window, Authentication, $timeout, GestionarCupones, Alertify, Transacciones, Cuentas) {

    var vm = this;
    vm.paypalfunds = {};
    vm.paypalfunds.item;
    vm.authentication = Authentication;
    vm.contador = 0;
    vm.aplicarCupon = function(codigo) {
      if (vm.restrict) {
        return;
      }
      vm.restrict = true;
      vm.data = {
        'codigo': codigo
      };
      GestionarCupones.getCouponInfo(vm.data, {
        success: function(response) {
          console.log(response.data);
          vm.data = response.data;
          if (vm.data.length === 0) {
            vm.contador = vm.contador + 1;
            vm.restante = 5 - vm.contador;
            if (vm.restante !== 0) {
              Alertify.error('ÉSTE CUPON NO APLICA, TIENES ' + vm.restante + ' INTENTOS RESTANTES');
              vm.restrict = false;
            }
            if (vm.restante === 0) {
              Cuentas.banUser(vm.authentication.user._id, {
                success: function(response) {
                  Alertify.error('TU CUENTA HA SIDO BANEADA PERMANENTEMENTE, TE REDIRECCIONAREMOS AL LOGIN');
                  setTimeout(
                    function() {
                      localStorage.removeItem('userSession');
                      document.location.href = '/api/auth/signout';
                    }, 3000);
                },
                error: function(response) {
                  console.log(response);
                }
              });
            }
            return;
          }
          vm.verificarEstado(vm.data);
        },
        error: function(response) {
          console.log(response);
          alert('error');
        }
      });
    };

    vm.verificarEstado = function(data) {
      if (parseInt(data[0].estado, 10) === 1) {
        Alertify.error('ÉSTE CUPON YA FUE ACTIVADO ANTERIORMENTE');
        vm.restrict = false;
        return;
      }
      vm.cambiarEstadoCupon(data[0]._id);
      vm.chargeBalance(vm.authentication.user._id, data);
    };

    vm.chargeBalance = function(id, data) {
      vm.transaction = {
        'tipo_recarga': 'Cupon de regalo',
        'soles_transferencia': data[0].soles,
        'transaccion_tipo': 'Crédito',
        'estado': 1,
        'tipo': 2,
        'descripcion': 'Cupón de regalo: ' + data[0].codigo,
        'user': id
      };
      Transacciones.createTransactionBalance(vm.transaction, {
        success: function(response) {
          vm.transactionAccount(response.data._id, data.codigo);
          vm.updateBalance(id, data[0].soles);
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
          Alertify.success('TU CUPÓN FUE ACTIVADO SATISFACTORIAMENTE, TIENES ' + amount + 'SOLSASOS GRATIS');
          setTimeout(function() {
            vm.restrict = false;
          }, 2000);

        }
      });
    };

    vm.transactionAccount = function(id, codigo) {
      vm.accountTransaction = {
        'identificador': codigo,
        'monto': 1,
        'tipo_moneda': 'Soles',
        'tipo_pago': 'Cupon de regalo',
        'transaccion': id
      };
      Transacciones.createTransactionAccount(vm.accountTransaction, {
        success: function(response) {
          console.log(response.data);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.cambiarEstadoCupon = function(idcupon) {
      vm.update = {
        'estado': 1
      };
      GestionarCupones.updateCouponStatus(idcupon, vm.update, {
        success: function(response) {
          console.log(response.data);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

  }
}());
