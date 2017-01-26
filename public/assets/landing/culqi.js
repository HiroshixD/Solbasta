
  //document.oncontextmenu = function(){return false}
  Culqi.codigoComercio = 'test_uAYHoP5lNFVA';
  $('#culqipayment').hide();
  $('#paypalpayment').hide();
  var terminos = false;
      var liindex = 0;

  var getTerminos = function() {
    terminos = !terminos;
  };

  var showCardButton = function() {
    $('#culqipayment').show();
    $('#paypalpayment').hide();
  };

  var showPaypalButton = function() {
    $('#paypalpayment').show();
    $('#culqipayment').hide();
  }

  var culqiPago = function() {
    if (terminos === false) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }
    if(parseFloat(localStorage.montoapagar) === 0) {
      alert('Elige un paquete antes de generar tu pago');
      return;
    }
    configurarpaquete(localStorage.montoapagar, localStorage.combos, localStorage.cantidad);
    $('#payment').fadeIn(2000);
  };
  localStorage.combos = 0;
  localStorage.cantidad = 0;
  localStorage.montoapagar = 0;

   $('li button').click(function() {
    var me = $(this);

    var cantidad = parseFloat($(this).parent().find('select').val());
    var preciounitario = parseFloat($(this).parent().find('label').attr('id'));
    var precio = parseFloat($(this).parent().find('price').attr('id'));
    var arrayPrice = [13.9, 33.3, 50.9, 72.6, 86.3, 100];
    var arrayQty = [1, 2, 3];
    var arrayBalanceAmout = [10, 25, 40, 60, 75, 100];

    if( $.inArray(precio, arrayPrice) == -1 || $.inArray(cantidad, arrayQty) == -1 || $.inArray(preciounitario, arrayBalanceAmout) == -1){
    me.html('No Añadido X');
    setTimeout(function() { 
        me.html('Agregar'); 
        alert('Tu cuenta será baneada permanentemente si continuas editando Html');
     }, 3000);
     return;
    }
    me.html('Añadido ☑');
    setTimeout(function(){ me.html('Agregar'); }, 3000);

    var paquete = parseFloat($(this).parent().find('label').attr('id')) * cantidad;
    var preciototal = Math.round(precio * cantidad) * 100 / 100;
    localStorage.combos = parseFloat(localStorage.combos) + parseFloat(paquete);
    $('#totalcombo').html('');
    $('#totalcombo').html('Total: ' + localStorage.combos+' soles<span> para jugar</span>');
    localStorage.cantidad = parseFloat(localStorage.cantidad) + cantidad;
    $('#cantidadcombo').html('');
    $('#cantidadcombo').html(localStorage.cantidad  + ' combos<span>agregados</span>')
    localStorage.montoapagar = parseFloat(localStorage.montoapagar) + preciototal;
    $('#preciototal').html('');
    $('#preciototal').html('s/.'+ localStorage.montoapagar +'<span>por la compra</span>');
    liindex = liindex + 1;
    $("#total").append('<li id="' + parseInt(liindex) +'"><span>Combo ' + preciounitario + ' soles</span><span>'+ cantidad +'</span><span>S/.'+preciototal+'</span><span class="red"><a onclick="hola($(this));" data-id="' + parseInt(liindex) +'" data-price="'+ preciounitario+'" data-qty="'+cantidad+'" data-total="'+preciototal+'" class="eliminar" href="#">Eliminar</a></span></li>');
   });

//$(document.body).on("click", ".eliminar", eliminar);

var hola = function(data){
  var index = $(data).data('id');
  var preciounitariorestante = $(data).data('price');
  var cantidadrestante = $(data).data('qty');
  var totalrestante = $(data).data('total');
  $('#' + index).remove();
  localStorage.combos = parseFloat(localStorage.combos) - parseFloat(preciounitariorestante);
  $('#totalcombo').html('');
  $('#totalcombo').html('Total: ' + localStorage.combos +' soles<span> para jugar</span>');
  localStorage.cantidad = parseFloat(localStorage.cantidad) - cantidadrestante;
  $('#cantidadcombo').html('');
  $('#cantidadcombo').html(localStorage.cantidad  + ' combos<span>agregados</span>')
  localStorage.montoapagar = parseFloat(localStorage.montoapagar) - totalrestante;
  $('#preciototal').html('');
  $('#preciototal').html('s/.'+ localStorage.montoapagar +'<span>por la compra</span>');

 };

    var configurarpaquete = function(monto, combos, cantidad) {
      Culqi.configurar({
        nombre: 'SOLBASTA',
        orden: 'x123131',
        moneda: 'PEN',
        descripcion: combos+ ' solsazos en compra para Subastar',
        monto: monto * 100,
        guardar: false
      });
      localStorage.culqi = 'CulqiPayment';
      localStorage.paquete = combos;
      Culqi.abrir();
    };

    var paypalPago = function() {
      if (terminos === false) {
        alert('Debes aceptar los términos y condiciones');
      return;
    }
      var s = '';
      var randomchar = function() {
        var n = Math.floor(Math.random() * 62);
        if (n < 10) return n; //  1-10
        if (n < 36) return String.fromCharCode(n + 55); //  A-Z
        return String.fromCharCode(n + 61); // a-z
      };
      while (s.length < 16) s += randomchar();
      localStorage.sessioncharge = s;
      var monto = parseFloat(localStorage.montoapagar) / 3.40;
      var combos = localStorage.combos;

    if(parseFloat(localStorage.montoapagar) === 0) {
      alert('Elige un paquete antes de generar tu pago');
      return;
    }
      $("#payment").append('<div style="display:none;"><form action="https://www.paypal.com/cgi-bin/webscr" method="post">' +
      ' <input type="hidden" name="business" value="info@disolu.com"> ' +
      ' <input type="hidden" name="cmd" value="_xclick"> ' + 
      '  <input type="hidden" name="item_name" value=' + combos + '>'+
      '  <input type="hidden" name="amount" value='+ monto +'>'+
      '  <input type="hidden" name="currency_code" value="USD">'+
      ' <input type="image" id="paypal" name="submit" border="0"'+
      ' src="https://www.paypalobjects.com/webstatic/en_US/i/btn/png/btn_buynow_107x26.png"'+
      ' alt="Buy Now">'+
      ' <img alt="" border="0" width="1" height="1"'+
      ' src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" ></div>');

var button = document.getElementById("paypal");
button.click();
};

  