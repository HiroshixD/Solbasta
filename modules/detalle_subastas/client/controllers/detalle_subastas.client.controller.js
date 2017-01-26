(function () {
  'use strict';

  angular
    .module('detalle_subastas')
    .controller('Detalle_subastasController', Detalle_subastasController);

  Detalle_subastasController.$inject = ['$http', '$scope', '$state', 'detalle_subastaResolve', '$window', 'Authentication', 'ProductosService', 'Tipo_subastasService', 'CommonService', 'Socket', 'Alertify'];

  function Detalle_subastasController($http, $scope, $state, detalle_subasta, $window, Authentication, ProductosService, Tipo_subastasService, CommonService, Socket, Alertify) {
    var vm = this;

    vm.detalle_subasta = detalle_subasta;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.productos = ProductosService.query();

    vm.getServerTime = function() {
      CommonService.getServerTime({
        success: function(response) {
          vm.servertime = response.data;
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.setLocale = function(datetime) {
      return CommonService.getLocale(datetime);
    };
    // Remove existing Detalle_subasta
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.detalle_subasta.$remove($state.go('detalle_subastas.list'));
      }
    }

    // Save Detalle_subasta
    function save(isValid) {
      if (!vm.fecha) {
        Alertify.error('Ingresa una fecha');
        return;
      }
      vm.hora = $('#hora').val();
      if (vm.hora.length === 4) {
        vm.hora = '0' + vm.hora;
      }
      var fecha = vm.fecha;
      var parts = fecha.split("-");
      var fecha_formateada = [parts[2], parts[1], parts[0]].join('-');
      vm.detalle_subasta.fecha_inicio = fecha_formateada + 'T' + vm.hora + ':00.000Z';

      var difference = moment(vm.detalle_subasta.fecha_inicio).add(5, 'hours') - moment(vm.servertime).add(5, 'hours');
      if (difference > 86400000) {
        vm.detalle_subasta.estado = 2;
      } else if (difference < 0) {
        Alertify.error("La fecha que ingresaste es inválida");
        return;
      } else {
        vm.detalle_subasta.estado = 1;
      }

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.detalle_subastaForm');
        return false;
      }

      // Create a new detalle_subasta, or update the current instance
      vm.detalle_subasta.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $http.get('/api/callfunction/' + res._id);
        $state.go('detalle_subastas.view', {
          detalle_subastaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    vm.getServerTime();
  }
}());
