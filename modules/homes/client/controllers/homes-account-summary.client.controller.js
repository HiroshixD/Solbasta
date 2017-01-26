(function () {
  'use strict';

  angular
    .module('homes')
    .controller('HomeSummaryAccountController', HomeSummaryAccountController);

  HomeSummaryAccountController.$inject = ['$rootScope', '$scope', '$state', '$window', 'Authentication', '$timeout', 'Transacciones', 'GestionarSubastas', 'ReferralsUsersService', 'UserSettingsService', 'Alertify'];

  function HomeSummaryAccountController($rootScope, $scope, $state, $window, Authentication, $timeout, Transacciones, GestionarSubastas, ReferralsUsersService, UserSettingsService, Alertify) {
    var vm = this;
    vm.userSession = JSON.parse(localStorage.getItem('userSession'));
    vm.referralcode = vm.userSession.referral_code;
    vm.userid = vm.userSession._id;

    vm.authentication = Authentication;

    vm.manageSuscription = function() {
      UserSettingsService.manageSuscriptions({
        success: function(response) {
          vm.authentication.user.suscriptionState = response.data;
        },
        error: function(response) {
          alert('error');
        }
      });
    };

    vm.getAllReminders = function() {
      UserSettingsService.getRemindersByUser(vm.userid, {
        success: function(response) {
          console.log('tu query ctm');
          console.log(response.data);
          vm.reminders = response.data;
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.removeReminderById = function(id) {
      vm.data = {
        'reminder': id
      };
      UserSettingsService.removeReminderById(vm.data, {
        success: function(response) {
          for (var i = 0; i < vm.reminders.length; i++) {
            if (vm.reminders[i]._id === id) {
              vm.reminders.splice(i, 1);
            }
          }
          Alertify.success(response.data);
        },
        error: function(response) {
          alert('error inesperado');
        }
      });
    };

    GestionarSubastas.getWinners(vm.userid, {
      success: function(response) {
        vm.win = Object.keys(response.data).length;
        if (Math.round(vm.win / 3) < vm.win / 4) {
          vm.buttons = Math.round(vm.win / 4) + 1;
        } else {
          vm.buttons = Math.round(vm.win / 4);
        }
        vm.bindButtons(vm.buttons);
      },
      error: function(response) {
        console.log(response);
      }
    });

    vm.bindButtons = function(qty) {
      vm.buttonsqty = [];
      for (var i = 1; i <= qty; i ++) {
        vm.buttonsqty.push(i);
      }
      console.log(vm.buttonsqty);
    };

    vm.getReferrals = function(code) {
      ReferralsUsersService.getReferrals(code, {
        success: function(response) {
          vm.referrals = response.data;
          vm.getQtyOfPending(vm.referrals);
          console.log('aqui tus referidos');
          console.log(response.data);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.getQtyOfPending = function(referrals) {
      vm.count = 0;
      for (var i in vm.referrals) {
        if (referrals[i].referral_account_status === false) {
          vm.count = vm.count + 1;
        }
      }
    };

    vm.getWonAuctions = function(index) {
      var skip = ((index + 1) * 4) - 4;
      $scope.objeto = { item: index };
      vm.data = {
        'idusuario': vm.userid,
        'skip': skip
      };
      GestionarSubastas.getWinnersSkipped(vm.data, {
        success: function(response) {
          console.log('las auctions loqiuto');
          console.log(response.data);
          vm.auctions = response.data;
        },
        error: function(response) {
          alert('error inesperado');
        }
      });
    };

    vm.getReferrals(vm.referralcode);
  }
}());
