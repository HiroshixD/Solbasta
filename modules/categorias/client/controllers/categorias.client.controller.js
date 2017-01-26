(function () {
  'use strict';

  angular
    .module('categorias')
    .controller('CategoriasController', CategoriasController);

  CategoriasController.$inject = ['$scope', '$state', 'categoriaResolve', '$window', 'Authentication', 'CategoriaAuctionService', 'FileUploader', '$timeout'];

  function CategoriasController($scope, $state, categoria, $window, Authentication, CategoriaAuctionService, FileUploader, $timeout) {
    var vm = this;
    vm.imageURL = 'http://www.coconutboard.gov.in/images/products-food.jpg';
    vm.categoria = categoria;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.cancelUpload = cancelUpload;

    // Creamos nueva instancia de FileUploader
    vm.uploader = new FileUploader({
      //  llama a la api para subir foto
      url: 'api/categoria/image',
      alias: 'categoryPicture',
      onAfterAddingFile: onAfterAddingFile,
      onSuccessItem: onSuccessItem,
      onErrorItem: onErrorItem
    });

    // Filtro de formatos aceptados
    vm.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    function onAfterAddingFile(fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            vm.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    }

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(fileItem, response, status, headers) {
      // Show success message
      vm.success = true;

      // Populate user object
      vm.user = Authentication.user = response;

      // Clear upload buttons
      cancelUpload();
      $state.go('categorias.list');
    }

    // Called after the user has failed to uploaded a new picture
    function onErrorItem(fileItem, response, status, headers) {
      // Clear upload buttons
      cancelUpload();

      // Show error message
      vm.error = response.message;
    }

    // Cancel the upload process
    function cancelUpload() {
      vm.uploader.clearQueue();
      vm.imageURL = 'https://www.familydollar.com/content/dam/familydollar/products-services/products-module-image.jpg';
    }

    // Remove existing Categoria
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.categoria.$remove($state.go('categorias.list'));
      }
    }

    // Save Categoria
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.categoriaForm');
        return false;
      }

      // Create a new categoria, or update the current instance
      vm.categoria.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        vm.uploader.onBeforeUploadItem = function(item) {
          item.formData.push({ id: res._id });
        };
        vm.success = vm.error = null;

        // Start upload
        vm.uploader.uploadAll();
/*        $state.go('categorias.view', {
          categoriaId: res._id
        });*/
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
