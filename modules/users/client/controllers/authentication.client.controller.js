(function () {
  'use strict';

  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['$rootScope', '$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', 'Alertify'];

  function AuthenticationController($rootScope, $scope, $state, $http, $location, $window, Authentication, PasswordValidator, Alertify) {
    var vm = this;
    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.signup = signup;
    vm.signin = signin;
    vm.callOauthProvider = callOauthProvider;
    $rootScope.bodyClass = "marfil";
    vm.verify;

    vm.ref = location.search.split('ref=')[1];
    if (vm.ref === undefined) {
      vm.referral = '';
      vm.txtref = false;
    } else {
      vm.referral = vm.ref;
      vm.txtref = true;
    }


    vm.terminos = false;

    vm.asignarAvatar = function(avatar) {
      $('html, body').animate({ scrollTop: 1000 }, 800);
      vm.avatar = avatar;
    };

    vm.terminosCondiciones = function() {
      vm.terminos = !vm.terminos;
    };

    // Get an eventual error defined in the URL query string:
    vm.error = $location.search().err;

    // If user is signed in then redirect back home

    function generarCodigo() {
      var s = '';
      var randomchar = function() {
        var n = Math.floor(Math.random() * 62);
        if (n < 10) return n; //  1-10
        if (n < 36) return String.fromCharCode(n + 55); //  A-Z
        return String.fromCharCode(n + 61); // a-z
      };
      while (s.length < 8) s += randomchar();
      vm.referral_code = s.toUpperCase();
    }

    function signup(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
        Alertify.error('Registro inválido, por favor verifica los campos');
        return false;
      }

      if (!vm.credentials) {
        Alertify.error('Por favor llena el formulario correctamente');
        return;
      }
      if (vm.terminos !== true) {
        Alertify.log('deberías aceptar los términos y condiciones');
        return;
      }
      if (vm.credentials.email !== vm.email2) {
        Alertify.log('Los emails no coinciden');
        return;
      }
      if (vm.credentials.password !== vm.password2) {
        Alertify.log('Las contraseñas que ingresaste no coinciden');
        return;
      }

      $('#registrarte').css('background-image', 'none');
      $(this).parent().remove();
      $('#personaje').css('opacity', '1').css('z-index', '30');
      $('#personaje').fadeIn(1000);
      $('html, body').animate({ scrollTop: 0 }, 800);
      if (vm.verify !== true) {
        vm.verify = true;
        return;
      }

      vm.error = null;

      vm.date = document.getElementById('birthDate').value;
      var newDate = vm.date.split('/').reverse().join('/');

      if (vm.credentials.secret === 'admin') {
        vm.credentials.roles = 'admin';
      } else {
        vm.credentials.roles = 'user';
      }
      vm.credentials.referral_code = vm.referral_code;
      vm.credentials.profileImageURL = vm.avatar;
      vm.credentials.ubigeoId = 1;
      vm.credentials.regionId = 1;
      vm.credentials.suscriptionState = true;
      vm.credentials.birthDate = newDate;
      vm.credentials.referral = vm.referral;

/*      if (vm.tipoderol === 'admin') {
        vm.credentials.roles.push('admin');
      } else {
        vm.credentials.roles.push('user');
      }*/

      $http.post('/api/auth/signup', vm.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        vm.verify = false;
        vm.authentication.user = response;
        if (response.roles[0] === 'user') {
          window.location.replace('/register/success');
        } else {
          window.location.replace('/admin');
        }
        // And redirect to the previous or home page
      }).error(function (response) {
        vm.error = response.message.toUpperCase();
        Alertify.error(vm.error);
        vm.verify = false;
        $('#personaje').fadeOut(1000);
        return;
      });
    }

    function signin(isValid) {
      vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      $http.post('/api/auth/signin', vm.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        vm.authentication.user = response;
        localStorage.userSession = JSON.stringify(response);
        if (response.roles[0] === 'user') {
          window.location.replace('/resumen');
        } else {
          window.location.replace('/admin');
        }
        // And redirect to the previous or home page

      }).error(function (response) {
        Alertify.error(response.message);
        vm.error = response.message;

      });
    }

    // OAuth provider request
    function callOauthProvider(url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }
      // Effectively call OAuth authentication route:
      window.location.href = url;
    }
    generarCodigo();
  }
}());
