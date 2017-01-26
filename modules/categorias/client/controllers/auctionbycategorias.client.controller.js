(function () {
  'use strict';

  angular
    .module('categorias')
    .controller('AuctionCategoriasController', AuctionCategoriasController);

  AuctionCategoriasController.$inject = ['$rootScope', 'CategoriasService', 'CategoriaAuctionService', '$stateParams', '$interval'];

  function AuctionCategoriasController($rootScope, CategoriasService, CategoriaAuctionService, $stateParams, $interval) {
    var vm = this;
    $rootScope.bodyClass = "cat-subastas";
    vm.categorias = CategoriasService.query();
    vm.url = $stateParams.categoriaId;

    vm.getAuctionsByCategorie = function(id) {
      CategoriaAuctionService.getAuctionByCategorie(id, {
        success: function(response) {
          vm.getAuctions(response.data);
          vm.getCategoryById(id);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.getAuctions = function(array) {
      vm.subastas = [];
      for (var i in array) {
        if (array[i].producto !== null) {
          vm.subastas.push(array[i]);
        }
      }
      console.log(vm.subastas);
      vm.processAuctions(vm.subastas);
    };

    vm.processAuctions = function (data) {
      console.log(data);
      var tiemporestante;
      angular.forEach(data, function (item) {
        var remaining = (item.tiempo_restante - 1000) / 1000;
        vm.intervalo = $interval(function() {
          tiemporestante = (remaining--) * 1000;
          if (tiemporestante) {
            item.remainingTime = tiemporestante;
            //  $scope.$apply;
          } else {
            vm.destroy();
          }
        }, 1000, 0);

        vm.destroy = function() {
          $interval.cancel(vm.intervalo);
        };

      });
    };

    vm.getCategoryById = function(id) {
      CategoriaAuctionService.getCategoryById(id, {
        success: function(response) {
          vm.nombrecategoria = response.data.nombre;
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.getFilter = function(item) {
      vm.filter = [];
      if (parseInt(item, 10) === 1 || parseInt(item, 10) === 2 || parseInt(item, 10) === 3) {
        vm.filter.estado = parseInt(item, 10);
        return;
      }
    };

    vm.getAuctionsByCategorie(vm.url);
    vm.getCategoryById(vm.url);

  }
}());
