//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('articles')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Articles, List Articles, Create Article
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Articles',
      state: 'articles',
      type: 'dropdown',
      roles: ['guest']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'articles', {
      title: 'List Articles',
      state: 'articles.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'articles', {
      title: 'Create Article',
      state: 'articles.create',
      roles: ['admin']
    });

  }
}());

