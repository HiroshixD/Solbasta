(function () {
  'use strict';

  angular
    .module('homes')
    .controller('HomeSuccessController', HomeSuccessController);

  HomeSuccessController.$inject = ['$rootScope', '$scope', '$state', '$window', 'Authentication', '$timeout', 'Cuentas', 'Transacciones', 'Alertify', 'UserSettingsService', 'ReferralsUsersService'];

  function HomeSuccessController($rootScope, $scope, $state, $window, Authentication, $timeout, Cuentas, Transacciones, Alertify, UserSettingsService, ReferralsUsersService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.userSession = JSON.parse(localStorage.getItem('userSession'));
    vm.userid = vm.userSession._id;
    vm.referido = vm.authentication.user.referral;

    vm.getIdReferrer = function() {
      UserSettingsService.getUserByReferralCode(vm.referido, {
        success: function(response) {
          if (response.data.length === 0) {
            return;
          }
          // Enviamos el parametro id que encontramos para lograr persistirlo
          vm.getStatusReferralAccount(response.data[0]._id);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    // Verifica Si el usuario ya recibió 5 solsazos con la primera recarga del referido
    vm.getStatusReferralAccount = function(id) {
      ReferralsUsersService.getReferralById(vm.userid, {
        success: function(response) {
          vm.status = response.data.referral_account_status;
          //  Si el bonus_status es false (osea no ha recibido), genera la transaccion, sino return.
          if (vm.status === true) {
            return;
          }
          vm.updateReferralStatus(vm.userid);
          //  Generamos la transaccion
          vm.createBonusTransactionBalance(id);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.updateReferralStatus = function(id) {
      vm.data = {
        'referral_account_status': true
      };
      ReferralsUsersService.updateReferralStatus(id, vm.data, {
        success: function(response) {
          console.log(response.data);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.updateBalance = function(userid, amount) {
      Cuentas.charge(userid, amount, {
        success: function(response) {
          $rootScope.bodyClass = 'marfil';
          if (parseInt(amount, 10) !== 5) {
            $rootScope.saldoglobal = response.data.monto;
            Alertify.log("Has recargado más soles, tu nuevo saldo es " + $rootScope.saldoglobal + ' soles ');
          }
          localStorage.removeItem('cantidad');
          localStorage.removeItem('combos');
          localStorage.removeItem('culqi');
          localStorage.removeItem('montoapagar');
          localStorage.removeItem('paquete');
          if (parseInt(amount, 10) === 5) {
            return;
          }
          vm.getIdReferrer();
        },
        error: function(response) {
        }
      });
    };

    vm.transactionAccount = function(idtransact, tx, cc, monto) {
      vm.accountTransaction = {
        'identificador': tx,
        'monto': monto,
        'tipo_moneda': cc,
        'tipo_pago': 'Paypal',
        'transaccion': idtransact
      };
      Transacciones.createTransactionAccount(vm.accountTransaction, {
        success: function(response) {
          console.log("status");
          console.log(response.data);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    //  Captura el valor tx y hace una consulta a la BBDD, si paypal ya procesÃƒÂ³ este valor ÃƒÂºnico
    //  el return serÃƒÂ­a false y no haria una recarga
    vm.paypalTransactionStatus = function(vars) {
      console.log(vars);
      Transacciones.getActualStatus(vars.tx, {
        success: function(response) {
          console.log(response.data.length);
          if (response.data.length === 0) {
            vm.createPaypalTransactionBalance(vars.amt, vars.tx, vars.cc, vars.item_name);
          } else {
            location.href = "/";
          }
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.createPaypalTransactionBalance = function(amount, tx, cc, soles) {
      var saldo;
      var descripcion;
      if (parseFloat(amount) === 0.01) {
        saldo = 20;
        descripcion = 'Compra de Pack de Solzasos(Principiante) / 10';
      } else if (parseFloat(amount) === 0.02) {
        saldo = 40;
        descripcion = 'Compra de Pack de Solzasos(Intermedio) / 40';
      } else if (parseFloat(amount) === 0.03) {
        saldo = 60;
        descripcion = 'Compra de Pack de Solzasos(Pro) / 60';
      } else {
        saldo = soles;
        descripcion = 'Compra de Pack Personalizado';
      }

      vm.transaction = {
        'tipo_recarga': 'Recarga Paypal',
        'soles_transferencia': saldo,
        'transaccion_tipo': 'Crédito',
        'estado': 1,
        'tipo': 0,
        'identificador': tx,
        'descripcion': descripcion,
        'user': vm.userid
      };
      Transacciones.createTransactionBalance(vm.transaction, {
        success: function(response) {
          vm.transactionAccount(response.data._id, tx, cc, saldo);
          vm.updateBalance(vm.userid, saldo);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.getUrlVars = function() {
      if (localStorage.sessioncharge) {
        var vars = [];
        var hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
        }
        if (!vars.tx) {
          alert('no vars.tx');
          location.href = "/";
        }
        vm.paypalTransactionStatus(vars);
        localStorage.removeItem('sessioncharge');
      } else if (localStorage.culqi) {
        var culqi = {};
        var monto = localStorage.paquete;
        culqi = JSON.parse(localStorage.culqi);
        console.log(culqi);
        vm.culqiTransactionStatus(culqi, monto);
        localStorage.removeItem('cantidad');
        localStorage.removeItem('combos');
        localStorage.removeItem('culqi');
        localStorage.removeItem('montoapagar');
        localStorage.removeItem('paquete');
      } else {
        location.href = "/";
      }
    };

    vm.culqiTransactionStatus = function(data, monto) {
      Transacciones.getActualStatus(data.id, {
        success: function(response) {
          console.log(response.data.length);
          vm.createCulqiTransactionBalance(monto, data.id, 'PEN', data.tarjeta.marca);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.createCulqiTransactionBalance = function(monto, token, cc, marca) {
      var descripcion;
      if (parseFloat(monto) === 20) {
        descripcion = 'Compra de Pack de Solzasos(Principiante) / 10';
      } else if (parseFloat(monto) === 40) {
        descripcion = 'Compra de Pack de Solzasos(Intermedio) / 40';
      } else if (parseFloat(monto) === 60) {
        descripcion = 'Compra de Pack de Solzasos(Pro) / 60';
      } else {
        descripcion = 'Compra de paquetes full';
      }
      vm.transaction = {
        'tipo_recarga': 'Tarjeta de crédito ' + marca,
        'soles_transferencia': monto,
        'transaccion_tipo': 'Crédito',
        'estado': 1,
        'tipo': 0,
        'identificador': token,
        'descripcion': descripcion,
        'user': vm.userid
      };
      Transacciones.createTransactionBalance(vm.transaction, {
        success: function(response) {
          vm.transactionAccount(response.data._id, token, cc, monto);
          vm.updateBalance(vm.userid, monto);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.createBonusTransactionBalance = function(id) {
      vm.transaction = {
        'tipo_recarga': 'Bono de 5 soles por referido',
        'soles_transferencia': 5,
        'transaccion_tipo': 'Crédito',
        'estado': 1,
        'tipo': 2,
        'identificador': 'ReferralBonus',
        'descripcion': 'Bono de Referido ' + vm.authentication.user.username + ' por recarga',
        'user': id
      };
      Transacciones.createTransactionBalance(vm.transaction, {
        success: function(response) {
          vm.transactionAccount(response.data._id, 'ReferralBonus', 'Soles');
          vm.updateBalance(id, 5);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.getUrlVars();
  }
}());
