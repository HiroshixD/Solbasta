// NAVEGACIÓN DEL SLIDER PRINCIPAL
$(document).ready(function() {
	$(document.body).on("click", ".envivo .mini-slider button", sliderjs);


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
if ($('#subastas .envivo').length > 0) {
	anchoMiniSlider();

	$(window).resize(function(){
		anchoMiniSlider();
	});	

	/* Dando ancho relativo al contenedor y a los items de cada producto */
	function anchoMiniSlider() {
		for (var v = 0; v < $('.envivo .mini-slider').length; v++) {
			var $imagenes = $('.envivo .imagenes').eq(v);
			var $aNumero = $imagenes.find('a').length;
			$imagenes.css('width', $aNumero * 100 + '%').find('a').css('width', 100 / $aNumero + '%');
		};
	}
};	

		/* Slider de las imagenes */
	function sliderjs(e){
		var $lasImagenes = $(this).parent().find('.imagenes'); 
		var anchoContenedor = $lasImagenes.css('width'); 
		var anchoElementoA = $lasImagenes.find('a').css('width'); 
		var marginLeft = $lasImagenes.css('margin-left');
		if ($(this).index() == 2) {
			//console.log('margin left: ' + marginLeft + ', ancho contenedor: ' + anchoContenedor + ', ancho de elemento A: ' + anchoElementoA);
			if (limpiaPixelesyMas(marginLeft) < (limpiaPixelesyMas(anchoContenedor) - limpiaPixelesyMas(anchoElementoA))) {
				//console.log('es menor, iré al siguiente elemento');
				$lasImagenes.css('margin-left', '-' + (limpiaPixelesyMas(marginLeft) + limpiaPixelesyMas(anchoElementoA)) + 'px');
			} else {
				$lasImagenes.css('margin-left', '0');
				//console.log('es mayor, greso al inicio');
			}
		} else { // click en 'Anterior'
			if (limpiaPixelesyMas(marginLeft) != 0) {
				$lasImagenes.css('margin-left', '-' + (limpiaPixelesyMas(marginLeft) - limpiaPixelesyMas(anchoElementoA)) + 'px');
			} 
		}		
	}


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

/* CREANDO EL MINI SCROLL DE 'HISTORIAL' EN 'DETALLES DE SUBASTA' */
var $sc = $('#historial ul');
if ($sc.length > 0) {
	$sc.jScrollPane({showArrows: false});
}	

/* SLIDE INFERIOR DE 'MI CUENTA (RESUMEN Y EDITAR INFORMACIÍON) ' */
var $lasSecciones = $('#secciones');
if ($lasSecciones.length > 0) { 
	/* Estoy en la pagina "Mi Cuenta: Resumen o editar información */
	var $secciones = $lasSecciones.find('> section'); /* Creo un array de todas las secciones: Videos, fotos, recordatorios, regalos, etc*/
	
	for (var a = 0; a < $secciones.length; a++) { /* Daré un ancho relativo al contenedor de los articulos */
		var numeroArticulos = $secciones.eq(a).find('article').length;
		if (numeroArticulos == 1) { /* Si no hay items entonces aparesco el aviso*/
			$secciones.eq(a).find('.accion').css('display', 'flex');
			$('#iconos').find('> button').eq(a).addClass('bacio');
			
		} else if (numeroArticulos > 4){ /* Hay más de 3 items (pongo 4 en la condicional xq el article.action tmb se cuenta como item)*/
			/* Averiguando ancho de cada articulo, sumado a su margin derecho */
			var $primerArticulo = $secciones.eq(a).find('article').eq(0);
			var anchoArticulo = $primerArticulo.css('width');
			var anchoRealDeArticulo = limpiaPixelesyMas($primerArticulo.css('margin-right')) + limpiaPixelesyMas(anchoArticulo);
			/* Dando ancho relativo al contenedor */
			var porcentajePorDar = (((anchoRealDeArticulo * (numeroArticulos - 2)) + limpiaPixelesyMas(anchoArticulo)) * 100) / limpiaPixelesyMas($secciones.eq(a).find('.contenedor').css('width'));
			$secciones.eq(a).find('.articulos').css('width', (porcentajePorDar + 0.4) + '%'); /* Se le sumo 0.4 xq en ciertos navegadores y resoluciones el porcentaje exacto no alcansa */
			/* Apareciendo flechas */
			$secciones.eq(a).find('> button').css('display', 'block'); 
		}
	};
	/* Trabajando con las flechitas */
	$secciones.find('> button').click(function(e){
		var $losArticulos = $(this).parent().find('article');

		var $primerArticulo = $losArticulos.eq(0);
		var anchoArticulo = $primerArticulo.css('width');

		var anchoRealDeArticulo = limpiaPixelesyMas($primerArticulo.css('margin-right')) + limpiaPixelesyMas(anchoArticulo);
		var anchoTriple = limpiaPixelesyMas(anchoRealDeArticulo * 3);

		var $articulos = $(this).parent().find('.articulos');
		var articulosMarginLeft = limpiaPixelesyMas($articulos.css('margin-left'));

		var operacion = ((($losArticulos.length - 1) - 1) / 3); /* Operación lógica aritmetica */
		var elnum = operacion.toString();

		if ($(this).index() == 3) { /* Se hiso Click en siguientes 3 */
			if (elnum.lastIndexOf('.') == -1) { /* No pertenece a un 'termino'. ( (4, 7, 10, 13, 16) | (1 x 3 + 1 = 4, 2 x 3 + 1 = 7, 3 x 3 + 1 = 10, etc) */
				if ((articulosMarginLeft + 1) < (anchoTriple * operacion)) {
					$articulos.css('margin-left', '-' + (articulosMarginLeft + anchoTriple) + 'px');
				}	else {
					$articulos.css('margin-left', '0');
				}	
			} else {
				if ((articulosMarginLeft + 1) < (anchoTriple * (operacion - 1))) {
					$articulos.css('margin-left', '-' + (articulosMarginLeft + anchoTriple) + 'px');
				} else {
					$articulos.css('margin-left', '0');
				}
			}
		} else if ($(this).index() == 2){ /* Se hiso Click en anteriores 3 */
			if (articulosMarginLeft != 0) {
				var operacion = limpiaPixelesyMas(articulosMarginLeft - anchoTriple);
				$articulos.css('margin-left', '-' + operacion + 'px');
			} 
		}
	});
	/* Apareciendo y desapareciendo el apartado correcto, dependiendo el click en los íconos */
	$('#iconos').find('> button').click(function(){
		var $laSeccion = $secciones.eq($(this).index());
		$laSeccion.css('opacity', '1').css('z-index', '20');
		$laSeccion.siblings().css('opacity', '0').css('z-index', '10');
	});	
};	

/* COPIANDO 'MI CÓDIGO' (SECCION: 'MI CUENTA') */
var $micodigo = $('#micodigo');
if ($micodigo.length > 0) {
	$micodigo.click(function(event){
		event.preventDefault();
		var $temp = $("<input>")
		$("body").append($temp);
		var $ticket = $micodigo.find('.icon-ticket');
		$temp.val($ticket.text()).select();
		document.execCommand("copy");
		$temp.remove();
		$ticket.css('color', '#A7B300').text('¡Copiado!');
	});
}

/* MI CUENTA -  'MIS DIRECCIONES' */
var $misDirecciones = $('#mis-direcciones');
if ($misDirecciones.length > 0) {
	var $direcciones = $('#direcciones').find('button');
	var $resumen = $misDirecciones.find('.resumen');
	/* Derivando funciones desde iconos medios a iconos inferiores*/
	var $lapiz = $resumen.find('p');
	$lapiz.find('span:nth-child(2)').click(function(){
		$direcciones.eq($(this).parent().index() - 2).click();
	});
	/* Función al 'click' de los iconos inferiores */
	$direcciones.click(function(){ 
		/* Cambiando Icono grandote XD*/
		$iconote = $resumen.find('i').eq($(this).index());
		$iconote.css('display', 'block');
		$iconote.siblings('i').css('display', 'none');
		/* Activando y desactivando iconos medios */
		var $iconito = $lapiz.eq($(this).index());
		$iconito.find('span').last().addClass('activo');
		$iconito.siblings().find('span').last().removeClass('activo');

		/* Activando y desactivando iconos inferiores*/
		$(this).addClass('activo');
		$(this).siblings().removeClass('activo');
		/* Aparecendo y desapareciendo formularios*/
		var $elFomulario = $misDirecciones.find('form').eq($(this).index());
		$elFomulario.css('opacity', '1').css('z-index', '20');
		$elFomulario.siblings().css('opacity', '0').css('z-index', '10');
	});
};

/* COPIANDO 'MI LINK REFERIDO' (SECCION: 'MI CUENTA - INVITADOS') */
var $invitados = $('#invitados');
if ($invitados.length > 0) {
	var $botonlink = $('#link-referido');
	$botonlink.click(function(event){
		var $temp = $("<input>")
		$("body").append($temp);
		var $link = $botonlink.find('span').eq(2).find('b');
		$temp.val($link.text()).select();
		document.execCommand("copy");
		$temp.remove();
		$botonlink.find('span').eq(1).css('color', '#fff').css('background-color', '#A7B300').text('¡Copiado!');
	});
}

/* FORMULARIO 'REGISTRARME', APARECIENDO APARTADO 'PERSONAJES' Y OTRAS COSAS */
var $registrarte = $('#registrarte');
if ($registrarte.length > 0) {
	/* Cambiando de clase a los inputs , si es q se rellenan*/
	$registrarte.find('form').find('input').change(function() { 
		$(this).addClass('lleno');
	});
	$registrarte.find('form').find('select').change(function() { 
		$(this).addClass('lleno');
	});

	/* Pasando a la siguiente parte */
	$('#siguiente').click(function(){
		$registrarte.css('background-image', 'none');
		$(this).parent().remove();
		$('#personaje').css('opacity', '1').css('z-index', '30');
		$('html, body').animate({scrollTop : 0},800);
	});
};

/* ESCOGIENDO MI PERSONAJE, EN EL FORMULARIO DE 'REGISTRARME' (Para mayor compatibilidad con IE)*/ 
var $personaje = $('#personaje');
if ($personaje.length > 0) {
	$personaje.find('label').find('img').click(function(){
		$("#" + $(this).parents("label").attr("for")).click();
	});
};

/* SECCIÓN 'INICIAR SESIÓN' */
var $iniciarsesion = $('#iniciar-sesion');
if ($iniciarsesion.length > 0) {
	$iniciarsesion.find('form').find('input').change(function() { 
		$(this).addClass('lleno');
	});
};
		
/* FORMULARIO 'CONTACTO' */
var $contacto = $('#contacto');
if ($contacto.length > 0) {
	var $temas = $('#temas');
	$contacto.find('.icon-flecha').click(function() { 
		if($temas.attr('class') != 'activado') {
			$temas.addClass('activado').removeClass('desactivado');
		} else {
			$temas.addClass('desactivado').removeClass('activado');
		}
	});
	$temas.find('span').click(function(event){
		event.preventDefault();
		$contacto.find('select').find('option').eq($(this).index() + 1).prop('selected', true).siblings().prop('selected', false);
		$temas.addClass('desactivado').removeClass('activado');
	});
};

/* EL SELECT ESPECIAL Q TIENE DOBLE LISTA PARA ESCOGER */
var $filtrarPor = $('.select-especial');
if ($filtrarPor.length > 0) {
	var $selectUl = $filtrarPor.find('ul');
	/* Agregando funcion al icono de flechita */
	$filtrarPor.find('.icon-flecha').click(function() { 
		if($selectUl.attr('class') != 'activado') {
			$selectUl.addClass('activado');
		} else {
			$selectUl.removeClass('activado');
		}
	});
	/* Para escoger un item LI */
	$filtrarPor.find('li').click(function(event){
		$filtrarPor.find('select').find('option').eq($(this).index() + 1).prop('selected', true).siblings().prop('selected', false);
		$selectUl.removeClass('activado');
	});
};

/* SECCIÓN: 'PREGUNTAS FRECUENTES' */
$preguntasf = $('#preguntas-frecuentes');
if ($preguntasf.length > 0) {
	/* Primer nivel*/
	$primernivel = $preguntasf.find('.am').find('> ul').find('> li');
	$primernivel.find('> h2').click(function(){
		if ($(this).parent().attr('class') != 'activado') {
			$(this).parent().addClass('activado').siblings().removeClass('activado');
		} else {
			$(this).parent().removeClass('activado');
		}
	});
	/* Segundo nivel */
	$primernivel.find('> ul').find('> li').find('> h3').click(function(){
		if ($(this).parent().attr('class') != 'activado') {
			$(this).parent().addClass('activado').siblings().removeClass('activado');
		} else {
			$(this).parent().removeClass('activado');
		}
	});	
};

/* SECCIÓN: 'POLITICAS DE PRIVACIDAD' */
$politica = $('#politica-de-privacidad');
if ($politica.length > 0) {
	/* creando el boton 'ver más...' */
	var $ul = $politica.find('> .am').find('> ul')
	var $lis = $ul.find('> li');
	for (var li = 0; li <= $lis.length; li++) {
		$lis.eq(li).find('> p').eq(0).append('<button class="ver-mas">ver más...</button>');
		/* Dandole función click al H2 */
		$lis.eq(li).find('> h2').eq(0).click(function(){
			/* Removiendo el 'activado a los LI hermanos */
			$(this).parent().siblings().removeClass('activado');
			/* Determinando si me expando o me contraigo XD */
			if ($(this).parent().attr('class') != 'activado') {
				$(this).parent().addClass('activado');
			} else {
				$(this).parent().removeClass('activado');
			}	
		});
		/* Derivando el click de 'ver más...' al del titulo h2 */
		$lis.eq(li).find('.ver-mas').click(function(){
			$(this).parent().parent().find('> h2').eq(0).click();
		})
	};
};

/* SECCIÓN: 'INFORMACIÓN Y SOPORTE' */
$infoysoporte = $('#informacion-y-soporte');
if ($infoysoporte.length > 0) {
	$infoysoporte.find('> .am').find('> ul').find('> li').find('> h2').click(function(){
		$(this).parent().siblings().removeClass('activado');
		if ($(this).parent().attr('class') != 'activado') {
			$(this).parent().addClass('activado');
		} else {
			$(this).parent().removeClass('activado');
		}
	});
};	

/* SECCIÓN: 'TERMINOS Y CONDICIONES DE USO' */
$terminosycondiciones = $('#terminos-y-condiciones');
if ($terminosycondiciones.length > 0) {
	$terminosycondiciones.find('> .am').find('> ul').find('> li').find('> h2').click(function(){
		$(this).parent().siblings().removeClass('activado');
		if ($(this).parent().attr('class') != 'activado') {
			$(this).parent().addClass('activado');
		} else {
			$(this).parent().removeClass('activado');
		}
	});
};

/* SLIDER DE LA SECCIÓN 'TIPOS DE SUBASTAS' */
var $tiposSubastas = $('#tipos-de-subastas');
if ($tiposSubastas.length > 0) {
	/* Dandole funciones a los botones */
	var $sliderTipos = $('#slider-tipos').find('button');
	var $contenedorUl = $('#contenedor ul');
	$sliderTipos.eq(0).click(function(){ /* Boton anterior */
		if ($contenedorUl.attr('class') == 'movido') {
			$contenedorUl.removeClass('movido');
		} 
	});
	$sliderTipos.eq(1).click(function(){ /* Boton siguiente */
		if ($contenedorUl.attr('class') == 'movido') {
			$contenedorUl.removeClass('movido');
		} else {
			$contenedorUl.addClass('movido');
		}	
	});
	/* Código descartado por falta de tiempo. Disolu si lees esto, me llegas al pincho cuando no respondes el chat de FB XD,
	var anchoContenedor = limpiaPixelesyMas($('#contenedor').width());
	var $elUl = $('#contenedor ul');
	var nTipos = $elUl.find('li').length;
	 Dando ancho relativo a cada LI  
	var anchoLiPorcentaje = limpiaPixelesyMas((100 - (1.2 * (nTipos - 1))) / nTipos); - El 1.2 es por se estableció previamente que se tendrá 1.2% de margin derecho -
	$elUl.find('li').css('width', anchoLiPorcentaje + '%');
	- Dando ancho al contenedor UL -
	var operacion = limpiaPixelesyMas(nTipos / 3);
	console.log(operacion);
	var elnum = operacion.toString();
	if (elnum.lastIndexOf('.') == -1) {
		$elUl.css('width', (Number(elnum) * 100) + '%');
	} else {
		var separo = elnum.split('.');
		$elUl.css('width', ((Number(separo[0]) * 100) + anchoLiPorcentaje) + '%');
	}
	*/
};

/* REFERENTE AL CALENDARIO */
var $calendario = $('.datepicker-here');
$calendario.datepicker({
		onHide: function(dp, animationCompleted){
			if (animationCompleted) {
			  $calendario.addClass('lleno');
			}
		}
});

/* FUNCIONES ÚTILES*/
function limpiaPixelesyMas(enpixeles) {
	var pxAString = enpixeles.toString();
	var limpiaA =  pxAString.replace('px','');
	var limpiaB =  limpiaA.replace('-','');
	var buscaDecimal = limpiaB.lastIndexOf('.');
	if (buscaDecimal == -1) {
		return Number(limpiaB);
	} else {
		var separo = limpiaB.split('.');
		if (separo[1].length >  2) {
			return Number(separo[0] + '.' + separo[1].substring(0, 2));
		} else {
			return Number(limpiaB);
		}
	}		
};
});