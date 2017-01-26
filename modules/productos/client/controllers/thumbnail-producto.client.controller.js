(function () {
  'use strict';

  angular
    .module('productos')
    .controller('ProductosThumbnailController', ProductosThumbnailController);

  ProductosThumbnailController.$inject = ['$scope', '$state', 'productoResolve', '$window', 'Authentication', 'FileUploader', '$timeout'];

  function ProductosThumbnailController($scope, $state, producto, $window, Authentication, FileUploader, $timeout) {
    var vm = this;
    vm.producto = producto;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.id = vm.producto._id;

    vm.thumbnailImageUrl_1 = vm.producto.thumbnail_1;
    vm.thumbnailImageUrl_2 = vm.producto.thumbnail_2;
    vm.thumbnailImageUrl_3 = vm.producto.thumbnail_3;
    vm.thumbnailImageUrl_4 = vm.producto.imagenUrl;
    vm.thumbnailImageUrl_1_mobil = vm.producto.thumbnail_1_mobil;
    vm.thumbnailImageUrl_2_mobil = vm.producto.thumbnail_2_mobil;
    vm.thumbnailImageUrl_3_mobil = vm.producto.thumbnail_3_mobil;
    vm.thumbnailImageUrl_4_mobil = vm.producto.imagenUrl_mobil;

    vm.uploadProfilePicture_1 = uploadProfilePicture_1;
    vm.uploadProfilePicture_2 = uploadProfilePicture_2;
    vm.uploadProfilePicture_3 = uploadProfilePicture_3;
    vm.uploadProfilePicture_4 = uploadProfilePicture_4;

    vm.uploadProfilePicture_1_mobil = uploadProfilePicture_1_mobil;
    vm.uploadProfilePicture_2_mobil = uploadProfilePicture_2_mobil;
    vm.uploadProfilePicture_3_mobil = uploadProfilePicture_3_mobil;
    vm.uploadProfilePicture_4_mobil = uploadProfilePicture_4_mobil;

    vm.cancelUpload_1 = cancelUpload_1;
    vm.cancelUpload_2 = cancelUpload_2;
    vm.cancelUpload_3 = cancelUpload_3;
    vm.cancelUpload_4 = cancelUpload_4;

    vm.cancelUpload_1_mobil = cancelUpload_1_mobil;
    vm.cancelUpload_2_mobil = cancelUpload_2_mobil;
    vm.cancelUpload_3_mobil = cancelUpload_3_mobil;
    vm.cancelUpload_4_mobil = cancelUpload_4_mobil;

    // Creamos nueva instancia de FileUploader
    vm.uploader_1 = new FileUploader({
      //  llama a la api para subir foto
      url: 'api/producto/thumbnail_1/' + vm.id,
      alias: 'newThumbnailPicture',
      onAfterAddingFile: onAfterAddingFile_1,
      onSuccessItem: onSuccessItem_1,
      onErrorItem: onErrorItem_1
    });

    vm.uploader_2 = new FileUploader({
      //  llama a la api para subir foto
      url: 'api/producto/thumbnail_2/' + vm.id,
      alias: 'newThumbnailPicture',
      onAfterAddingFile: onAfterAddingFile_2,
      onSuccessItem: onSuccessItem_2,
      onErrorItem: onErrorItem_2
    });

    vm.uploader_3 = new FileUploader({
      //  llama a la api para subir foto
      url: 'api/producto/thumbnail_3/' + vm.id,
      alias: 'newThumbnailPicture',
      onAfterAddingFile: onAfterAddingFile_3,
      onSuccessItem: onSuccessItem_3,
      onErrorItem: onErrorItem_3
    });

    vm.uploader_4 = new FileUploader({
      //  llama a la api para subir foto
      url: 'api/producto/imagenurl/' + vm.id,
      alias: 'newThumbnailPicture',
      onAfterAddingFile: onAfterAddingFile_4,
      onSuccessItem: onSuccessItem_4,
      onErrorItem: onErrorItem_4
    });

    // Creamos nueva instancia de FileUploader
    vm.uploader_1_mobil = new FileUploader({
      //  llama a la api para subir foto
      url: 'api/producto/thumbnail_1_mobil/' + vm.id,
      alias: 'newThumbnailPicture',
      onAfterAddingFile: onAfterAddingFile_1_mobil,
      onSuccessItem: onSuccessItem_1_mobil,
      onErrorItem: onErrorItem_1_mobil
    });

    vm.uploader_2_mobil = new FileUploader({
      //  llama a la api para subir foto
      url: 'api/producto/thumbnail_2_mobil/' + vm.id,
      alias: 'newThumbnailPicture',
      onAfterAddingFile: onAfterAddingFile_2_mobil,
      onSuccessItem: onSuccessItem_2_mobil,
      onErrorItem: onErrorItem_2_mobil
    });

    vm.uploader_3_mobil = new FileUploader({
      //  llama a la api para subir foto
      url: 'api/producto/thumbnail_3_mobil/' + vm.id,
      alias: 'newThumbnailPicture',
      onAfterAddingFile: onAfterAddingFile_3_mobil,
      onSuccessItem: onSuccessItem_3_mobil,
      onErrorItem: onErrorItem_3_mobil
    });

    vm.uploader_4_mobil = new FileUploader({
      //  llama a la api para subir foto
      url: 'api/producto/imagenurl_mobil/' + vm.id,
      alias: 'newThumbnailPicture',
      onAfterAddingFile: onAfterAddingFile_4_mobil,
      onSuccessItem: onSuccessItem_4_mobil,
      onErrorItem: onErrorItem_4_mobil
    });

    // Filtro de formatos aceptados
    vm.uploader_1.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    vm.uploader_2.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    vm.uploader_3.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    vm.uploader_4.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    vm.uploader_1_mobil.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    vm.uploader_2_mobil.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    vm.uploader_3_mobil.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    vm.uploader_4_mobil.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });


    // Called after the user selected a new picture file
    function onAfterAddingFile_1(fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            vm.thumbnailImageUrl_1 = fileReaderEvent.target.result;
          }, 0);
        };
      }
    }

    function onAfterAddingFile_2(fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            vm.thumbnailImageUrl_2 = fileReaderEvent.target.result;
          }, 0);
        };
      }
    }

    function onAfterAddingFile_3(fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            vm.thumbnailImageUrl_3 = fileReaderEvent.target.result;
          }, 0);
        };
      }
    }

    function onAfterAddingFile_4(fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            vm.thumbnailImageUrl_4 = fileReaderEvent.target.result;
          }, 0);
        };
      }
    }


  // Called after the user selected a new picture file
    function onAfterAddingFile_1_mobil(fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            vm.thumbnailImageUrl_1_mobil = fileReaderEvent.target.result;
          }, 0);
        };
      }
    }

    function onAfterAddingFile_2_mobil(fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            vm.thumbnailImageUrl_2_mobil = fileReaderEvent.target.result;
          }, 0);
        };
      }
    }

    function onAfterAddingFile_3_mobil(fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            vm.thumbnailImageUrl_3_mobil = fileReaderEvent.target.result;
          }, 0);
        };
      }
    }

    function onAfterAddingFile_4_mobil(fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            vm.thumbnailImageUrl_4_mobil = fileReaderEvent.target.result;
          }, 0);
        };
      }
    }


    // Called after the user has successfully uploaded a new picture
    function onSuccessItem_1(fileItem, response, status, headers) {
      // Show success message
      vm.success = true;
      alert('El item se ha subido satisfactoriamente');
      // Populate user object
      cancelUpload_1();
    }

    function onSuccessItem_2(fileItem, response, status, headers) {
      // Show success message
      vm.success = true;
      alert('El item se ha subido satisfactoriamente');
      // Clear upload buttons
      cancelUpload_2();
    }

    function onSuccessItem_3(fileItem, response, status, headers) {
      // Show success message
      vm.success = true;
      alert('El item se ha subido satisfactoriamente');
      // Populate user object
      cancelUpload_3();
    }

    function onSuccessItem_4(fileItem, response, status, headers) {
      // Show success message
      vm.success = true;
      alert('El item se ha subido satisfactoriamente');
      // Populate user object
      cancelUpload_4();
    }

    function onSuccessItem_1_mobil(fileItem, response, status, headers) {
      // Show success message
      vm.success = true;
      alert('El item se ha subido satisfactoriamente');
      // Populate user object
      cancelUpload_1();
    }

    function onSuccessItem_2_mobil(fileItem, response, status, headers) {
      // Show success message
      vm.success = true;
      alert('El item se ha subido satisfactoriamente');
      // Clear upload buttons
      cancelUpload_2();
    }

    function onSuccessItem_3_mobil(fileItem, response, status, headers) {
      // Show success message
      vm.success = true;
      alert('El item se ha subido satisfactoriamente');
      // Populate user object
      cancelUpload_3();
    }

    function onSuccessItem_4_mobil(fileItem, response, status, headers) {
      // Show success message
      vm.success = true;
      alert('El item se ha subido satisfactoriamente');
      // Populate user object
      cancelUpload_4();
    }

    function onErrorItem_1(fileItem, response, status, headers) {
      // Clear upload buttons
      cancelUpload_1();

      // Show error message
      vm.error = response.message;
    }

    function onErrorItem_2(fileItem, response, status, headers) {
      // Clear upload buttons
      cancelUpload_2();

      // Show error message
      vm.error = response.message;
    }

    // Called after the user has failed to uploaded a new picture
    function onErrorItem_3(fileItem, response, status, headers) {
      // Clear upload buttons
      cancelUpload_3();

      // Show error message
      vm.error = response.message;
    }

    function onErrorItem_4(fileItem, response, status, headers) {
      // Clear upload buttons
      cancelUpload_4();

      // Show error message
      vm.error = response.message;
    }

    function onErrorItem_1_mobil(fileItem, response, status, headers) {
      // Clear upload buttons
      cancelUpload_1_mobil();

      // Show error message
      vm.error = response.message;
    }

    function onErrorItem_2_mobil(fileItem, response, status, headers) {
      // Clear upload buttons
      cancelUpload_2_mobil();

      // Show error message
      vm.error = response.message;
    }

    // Called after the user has failed to uploaded a new picture
    function onErrorItem_3_mobil(fileItem, response, status, headers) {
      // Clear upload buttons
      cancelUpload_3_mobil();

      // Show error message
      vm.error = response.message;
    }

    function onErrorItem_4_mobil(fileItem, response, status, headers) {
      // Clear upload buttons
      cancelUpload_4_mobil();

      // Show error message
      vm.error = response.message;
    }

    // Change user profile picture
    function uploadProfilePicture_1() {
      // Clear messages
      vm.success = vm.error = null;

      // Start upload
      vm.uploader_1.uploadAll();
    }

    function uploadProfilePicture_2() {
      // Clear messages
      vm.success = vm.error = null;

      // Start upload
      vm.uploader_2.uploadAll();
    }

    function uploadProfilePicture_3() {
      // Clear messages
      vm.success = vm.error = null;

      // Start upload
      vm.uploader_3.uploadAll();
    }

    function uploadProfilePicture_4() {
      // Clear messages
      vm.success = vm.error = null;

      // Start upload
      vm.uploader_4.uploadAll();
    }

    function uploadProfilePicture_1_mobil() {
      // Clear messages
      vm.success = vm.error = null;

      // Start upload
      vm.uploader_1_mobil.uploadAll();
    }

    function uploadProfilePicture_2_mobil() {
      // Clear messages
      vm.success = vm.error = null;

      // Start upload
      vm.uploader_2_mobil.uploadAll();
    }

    function uploadProfilePicture_3_mobil() {
      // Clear messages
      vm.success = vm.error = null;

      // Start upload
      vm.uploader_3_mobil.uploadAll();
    }

    function uploadProfilePicture_4_mobil() {
      // Clear messages
      vm.success = vm.error = null;

      // Start upload
      vm.uploader_4_mobil.uploadAll();
    }

    // Cancel the upload process
    function cancelUpload_1() {
      vm.uploader_1.clearQueue();
      //  vm.thumbnailImageUrl_1 = vm.producto.thumbnail_1;
    }

    function cancelUpload_2() {
      vm.uploader_2.clearQueue();
      //  vm.thumbnailImageUrl_2 = vm.producto.thumbnail_2;
    }

    function cancelUpload_3() {
      vm.uploader_3.clearQueue();
      //  vm.thumbnailImageUrl_3 = vm.producto.thumbnail_3;
    }

    function cancelUpload_4() {
      vm.uploader_4.clearQueue();
      //  vm.thumbnailImageUrl_3 = vm.producto.thumbnail_3;
    }

    function cancelUpload_1_mobil() {
      vm.uploader_1_mobil.clearQueue();
      //  vm.thumbnailImageUrl_1 = vm.producto.thumbnail_1;
    }

    function cancelUpload_2_mobil() {
      vm.uploader_2_mobil.clearQueue();
      //  vm.thumbnailImageUrl_2 = vm.producto.thumbnail_2;
    }

    function cancelUpload_3_mobil() {
      vm.uploader_3_mobil.clearQueue();
      //  vm.thumbnailImageUrl_3 = vm.producto.thumbnail_3;
    }

    function cancelUpload_4_mobil() {
      vm.uploader_4_mobil.clearQueue();
      //  vm.thumbnailImageUrl_3 = vm.producto.thumbnail_3;
    }

  }
}());
