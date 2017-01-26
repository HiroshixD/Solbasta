(function () {
  'use strict';

  angular
    .module('testimonios')
    .controller('TestimoniosListController', TestimoniosListController);

  TestimoniosListController.$inject = ['TestimoniosService'];

  function TestimoniosListController(TestimoniosService) {
    var vm = this;

    vm.testimonios = TestimoniosService.query();
  }
}());
