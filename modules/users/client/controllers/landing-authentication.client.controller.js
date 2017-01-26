(function () {
  'use strict';

  angular
    .module('users')
    .controller('Landing_Users', Landing_Users);

  Landing_Users.$inject = ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', 'Alertify'];

  function Landing_Users($scope, $state, $http, $location, $window, Authentication, PasswordValidator, Alertify) {
    var vm = this;
    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.signup = signup;
    vm.signin = signin;
    vm.callOauthProvider = callOauthProvider;
    vm.formclass = 'signin';

    // Get an eventual error defined in the URL query string:
    vm.error = $location.search().err;

    // If user is signed in then redirect back home
/*    if (vm.authentication.user) {
      $location.path('/');
    }*/

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
      vm.nickname = 'solbasta_user_' + vm.referral_code;
    }

    function signup(isValid) {
      vm.error = null;

      vm.credentials.lastName = [];
      vm.credentials.birthDate = [];
      vm.credentials.gender = [];
      vm.credentials.telefono = [];
      vm.credentials.docNumber = [];
      vm.credentials.roles = [];
      vm.credentials.referral = [];
      vm.credentials.username = [];

      vm.credentials.roles.push('user');
      vm.credentials.lastName.push('Register');
      vm.credentials.birthDate.push('2000-01-01');
      vm.credentials.gender.push('L');
      vm.credentials.telefono.push('LandingDATA');
      vm.credentials.docType = 1;
      vm.credentials.docNumber.push('LandingData');
      vm.credentials.ubigeoId = 1;
      vm.credentials.regionId = 1;
      vm.credentials.referral.push('Landing');
      vm.credentials.username.push(vm.nickname);

      vm.credentials.referral_code = [];
      vm.credentials.referral_code.push(vm.referral_code);


      if (!isValid) {
        Alertify.error('Error, por favor verifica el formulario');
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      $http.post('/api/auth/signup', vm.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        vm.authentication.user = response;
        if (response.roles[0] === 'user') {
          vm.formclass = 'mensaje';
          //  window.location.replace('/register/success');
        } else {
          window.location.replace('/admin');
        }
        // And redirect to the previous or home page
      }).error(function (response) {
        vm.error = response.message;
        Alertify.error(vm.error);
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
        if (response.roles[0] === 'user') {
          window.location.replace('/user');
        } else {
          window.location.replace('/admin');
        }
        // And redirect to the previous or home page

      }).error(function (response) {
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
