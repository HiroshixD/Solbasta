var puesto = 2;
var $imagenes = $('.imagenes img');

window.setInterval(function(){
  //
}, 5000);


$("form").submit(function( event ) {
	event.preventDefault(); // Quitar esta linea cuando funcione el formulario
  $('form').addClass('mensaje');
});