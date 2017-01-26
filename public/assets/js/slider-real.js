// NAVEGACIÓN DEL SLIDER PRINCIPAL
var sl = $('#slider #contenedor');
if (sl.length > 0) {
	var ps = 1;
	// CLICK SIGUIENTE
	$('#slider > button').eq(1).click(function(e) {
		if (ps < 4) {
			var por = ps * 100;
			sl.css('margin-left','-'+ por +'%');
			ps = ps + 1;
		} else {
			sl.css('margin-left','0');
			ps = 1;
		}
		var boton = $('#bolitas > button');
		boton.removeClass('activo');
		boton.eq(ps - 1).addClass('activo');
	});
	// CLICK ANTERIOR
	$('#slider > button').eq(0).click(function(e) {
		if (ps != 1) {
			// nada
			ps = ps - 1;
			var por = (ps * 100) - 100;
			sl.css('margin-left','-'+ por +'%');
		} else {
			sl.css('margin-left','0')
		}
		var boton = $('#bolitas > button');
		boton.removeClass('activo');
		boton.eq(ps - 1).addClass('activo');
	});
	// CREANDO BOLITAS;
	var cuantos = $('#slider #contenedor .texto-imagen').length;
	for(c = 1; c <= cuantos; c++) {
		$('#bolitas').append('<button></button>');
	}
	$('#bolitas > button').eq(0).addClass('activo');
	// CLICK EN BOLITA
	var cboton = $('#bolitas > button');
	cboton.click(function(e) {
		ps = cboton.index(this);
		clickensiguiente();
	});

	// Loop del slider;
	var elloopslider;
	elloopslider = setInterval(clickensiguiente, 10000); 
	// Bindeando eventos
	$('#slider').hover( function() {
		clearInterval(elloopslider);
	}, function(){
		elloopslider = setInterval(clickensiguiente, 10000); 
	});
	//Función útil
	function clickensiguiente() {
		$('#slider > button').eq(1).click();
	};
};


/* NAVEGACIÓN DE IMAGENES DE 'SUBASTAS EN VIVO' */
	/* Dando ancho relativo al contenedor y a los items de cada producto */
if ($('#subastas .envivo').length > 0) {
	anchoMiniSlider();

	$(window).resize(function(){
		anchoMiniSlider();
	});	
	function anchoMiniSlider() {
		for (var v = 0; v < $('.envivo .mini-slider').length; v++) {
			var $imagenes = $('.envivo .imagenes').eq(v);
			var $aNumero = $imagenes.find('a').length;
			$imagenes.css('width', $aNumero * 100 + '%').find('a').css('width', 100 / $aNumero + '%');
		};
	}
		/* Slider de las imagenes */
	$('.envivo .mini-slider button').click(function(e) { /* Siguiente */
		var $queBoton = $(e.target); // 2 = siguiente, 1 = anterior | orden de elementos, contando desde su padre. (Nota: mejorar esta wada :V)
		console.log($queBoton.index());
		var $lasImagenes = $queBoton.parent().find('.imagenes'); 
		var anchoContenedor = $lasImagenes.css('width'); 
		var anchoElementoA = $lasImagenes.find('a').css('width'); 
		var marginLeft = $lasImagenes.css('margin-left');
		if ($queBoton.index() == 2) {
			//console.log('margin left: ' + marginLeft + ', ancho contenedor: ' + anchoContenedor + ', ancho de elemento A: ' + anchoElementoA);
			if (Number(limpiaPixelesyMas(marginLeft)) < (Number(limpiaPixelesyMas(anchoContenedor)) - Number(limpiaPixelesyMas(anchoElementoA)))) {
				//console.log('es menor, iré al siguiente elemento');
				$lasImagenes.css('margin-left', '-' + (Number(limpiaPixelesyMas(marginLeft)) + Number(limpiaPixelesyMas(anchoElementoA))) + 'px');
			} else {
				$lasImagenes.css('margin-left', '0');
				//console.log('es mayor, greso al inicio');
			}
		} else { // click en 'Anterior'
			if (Number(limpiaPixelesyMas(marginLeft)) != 0) {
				$lasImagenes.css('margin-left', '-' + (Number(limpiaPixelesyMas(marginLeft)) - Number(limpiaPixelesyMas(anchoElementoA))) + 'px');
			} 
		}		
	});

	function limpiaPixelesyMas(enpixeles) {
		var limpiaA =  enpixeles.replace('px','');
		var limpiaB =  limpiaA.replace('-','');
		return limpiaB;
	}
};	

/* MINI SLIDER DE 'DETALLE DE SUBASTA' */
var $ms = $('#mini-slider #imagenes');
if ($ms.length > 0) {
	var $mi = $('#grande').find('img'); // cacheo imagenes
	$ms.find('li').on("mouseenter", function() { // agregando funcion hover
		$(this).siblings().find('img').css('opacity', '.5');
		$laImagen = $mi.eq($(this).index());
		$laImagen.siblings().css('opacity', '0');
		$laImagen.css('opacity', '1');
  });
};	

/* Creado el mini scroll de 'Historial' en 'detalles de subasta' */
var $sc = $('#historial ul');
if ($sc.length > 0) {
	$sc.jScrollPane({showArrows: false});
}	