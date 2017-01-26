(function () {
  'use strict';

  angular
    .module('productos')
    .controller('SlidersListController', SlidersListController);

  SlidersListController.$inject = ['SliderService'];

  function SlidersListController(SliderService) {
    var vm = this;

    vm.getSliders = function() {
      SliderService.getSliders({
        success: function(response) {
          vm.productos = response.data;
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.getSliders();
  }
}());
