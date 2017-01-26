(function () {
  'use strict';

  angular
    .module('commons.services')
    .factory('Messages', Messages);

  Messages.$inject = ['$http', '$timeout', '$interval'];

  function Messages($http, $timeout, $interval) {
    var me = this;
    //  });
    me.outOfBalance = function () {
      return "No tienes saldo suficiente para ofertar";
    };
    me.bidError = function() {
      return "No puedes pujar sobre tu última oferta";
    };
    me.beginnerAuction = function() {
      return "Alerta: Ésta subasta es sólo para novatos";
    };
    me.birthAuction = function() {
      return "No puedes ofertar aquí, esta oferta es solo para cumpleañeros";
    };
    me.balanceAuction = function() {
      return "Ésta subasta es exclusiva para usuarios con saldo menor o igual a 20 nuevos soles";
    };
    me.revengeAuction = function() {
      return "Tú ya has ganado premios anteriormente, ésta subasta es para aquellos que no han ganado aún";
    };
    return {
      outOfBalance: me.outOfBalance,
      bidError: me.bidError,
      beginnerAuction: me.beginnerAuction,
      birthAuction: me.birthAuction,
      balanceAuction: me.balanceAuction,
      revengeAuction: me.revengeAuction
    };
  }
}());
