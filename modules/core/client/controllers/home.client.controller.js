(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$rootScope', '$http', '$scope', '$state', 'Authentication', 'menuService', 'CuentasService', 'SliderService'];


  function HomeController($rootScope, $http, $scope, $state, Authentication, menuService, CuentasService, SliderService) {
    var vm = this;

    $http.get('/api/dailytransactions').success(function (response) {
      vm.data = response;
      console.log(vm.data);
      vm.monto = 0;
      for (var i = 0; i < vm.data.length; i++) {
        vm.monto = vm.monto + vm.data[i].monto;
      }
    }).error(function (response) {
      console.log(response);
    });

    $http.get('/api/beforedaytransactions').success(function (response) {
      vm.beforeday = response;
      console.log(vm.beforeday);
      vm.beforemonto = 0;
      for (var i = 0; i < vm.beforeday.length; i++) {
        vm.beforemonto = vm.beforemonto + vm.beforeday[i].monto;
      }
    }).error(function (response) {
      console.log(response);
    });


  }
}());
