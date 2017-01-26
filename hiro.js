'use strict';
var seeder = require('mongoose-seed');
var moment = require('moment');
var fechaahora = Date.now();
var now = moment.utc();

// Connect to MongoDB via Mongoose 
seeder.connect('mongodb://localhost/mean-dev', function() {
 
    // Load Mongoose models 
    seeder.loadModels([
        'modules/tipo_subastas/server/models/tipo_subasta.server.model.js',
        'modules/categorias/server/models/categoria.server.model.js',
        'modules/marcas/server/models/marca.server.model.js',
        'modules/productos/server/models/producto.server.model.js',
        'modules/detalle_subastas/server/models/detalle_subasta.server.model.js'



    ]);
 
    // Clear specified collections 
    seeder.clearModels(['Tipo_subasta', 'Categoria', 'Marca', 'Producto', 'Detalle_subasta'], function() {
 
        // Callback to populate DB once collections have been cleared 
        seeder.populateModels(data);
 
    });
});

var data = [
			{
			    "model": "Tipo_subasta",
			    "documents": [
			        {	
			        	"nro_tipo"	: 1, 
			            "nombre"	: "Subasta Estándar",
			            "estado": 1,
			            "icono": "https://www.lukana.pe/img/pages/auction_type/ribbon_destacada.png",
			            "descripcion":"Es una subasta típica al centavo en la que pueden participar todos los usuarios sin restricciones."
			        },
			        {	
			        	"nro_tipo"	: 2, 
			            "nombre"	: "Subasta Los Novatos:",
			            "estado": 1,
			            "icono": "https://www.lukana.pe/img/pages/auction_type/ribbon_anti.png",
			            "descripcion":"Es una subasta en la que solo pueden participar las personas que se hayan registrado en la última semana."
			        },
			        {	
			        	"nro_tipo"	: 3, 
			            "nombre"	: "Subasta Los Cumpleañeros",
			            "estado": 1,
			            "icono": "https://www.lukana.pe/img/pages/auction_type/ribbon_bienvenida.png",
			            "descripcion":"Es una subasta en la que solo pueden participar los usuarios cuya fecha de cumpleaños sea en el mes en que se realiza la subasta"
			        },
			        {	
			        	"nro_tipo"	: 4, 
			            "nombre"	: "Subasta -20 Basta:",
			            "estado": 1,
			            "icono": "https://www.lukana.pe/img/pages/auction_type/ribbon_limited.png",
			            "descripcion":" Es una subasta en la que solo pueden jugar los usuarios que tienen un saldo de 20 soles o menos en su cuenta en el momento de la subasta.."
			        },
			        {	
			        	"nro_tipo"	: 5, 
			            "nombre"	: "Subasta La Revancha",
			            "estado": 1,
			            "icono": "https://www.lukana.pe/img/pages/auction_type/ribbon_diez.png",
			            "descripcion":"es una subasta en la que solo pueden jugar las personas que nunca hayan ganado algún producto o servicio."
			        },
			        {	
			        	"nro_tipo"	: 6, 
			            "nombre"	: "Subasta la rapidita",
			            "estado": 1,
			            "icono": "https://www.lukana.pe/img/pages/auction_type/ribbon_diurna.png",
			            "descripcion":"es una subasta en la que la persona que consiga llegar antes que los otros jugadores a un numero ‘x’ de ofertas, es quien será automáticamente el ganador de la subasta. Por ejemplo, en la rapidita (20) el jugador que llegue primero a un total de 20 ofertas realizadas será el ganador; debes recordar una persona no puede realizar dos ofertas seguidas, sino que debe esperar a que alguien más realice una oferta antes de volver a ofertar."
			        }
			    ]
				},
			{
				"model": "Categoria",
				"documents": [
				{	
					"_id": "57977bdc302029f8167ebc60",
					"created": Date.now(),
					"nombre": "Accesorios y Cuidado Personal",
					"estado": 1,
					"imageURL": "modules/categorias/client/img/3241d7a4512e4cab5e4e06a06c684e6ed9a94323.jpg",
					"user": "579a95c527fc04b8013c3ebd"
				},
				{
					"_id":"57977bdc302029f8167ebc61",
					"created": Date.now(),
					"nombre": "Deportes y recreación",
					"estado": 1,
					"imageURL": "modules/categorias/client/img/427c07d0fc779db5f78da3d33696f3c11423b02b.jpg",
					"user": "579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977bdc302029f8167ebc62",
					"created": Date.now(),
					"nombre": "Electrodomésticos",
					"estado": 1,
					"imageURL": "modules/categorias/client/img/92f14d258bd21eb6627b2745b07ecc2d0001deb1.jpg",
					"user": "579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977bdc302029f8167ebc63",
					"created": Date.now(),
					"nombre": "Electrónicos",
					"estado": 1,
					"imageURL": "modules/categorias/client/img/0675329f9b5cb1127801a590d2dcc34b3218f9fb.jpg",
					"user": "579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977bdc302029f8167ebc64",
					"created": Date.now(),
					"nombre": "Juegos Y Juguetes",
					"estado": 1,
					"imageURL": "modules/categorias/client/img/6e0e88823bbbf4b109fc6f0dbf7120a2c7598f6c.jpg",
					"user": "579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977bdc302029f8167ebc65",
					"created": Date.now(),
					"nombre": "Licores",
					"estado": 1,
					"imageURL": "modules/categorias/client/img/9d2447a0ca96b9f82a50802f53868df0ca24b614.jpg",
					"user": "579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977bdc302029f8167ebc66",
					"created": Date.now(),
					"nombre": "Paquetes de Soles",
					"estado": 1,
					"imageURL": "modules/categorias/client/img/829f65bdf35aa4c846b329f26d43007312b669d2.jpg",
					"user": "579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977bdc302029f8167ebc67",
					"created": Date.now(),
					"nombre": "Tarjetas de Regalo",
					"estado": 1,
					"imageURL": "modules/categorias/client/img/60e4e553d55917588e5549d5d418ab55ad56a816.jpg",
					"user": "579a95c527fc04b8013c3ebd"
				}

				]
			},
			{
				"model": "Marca",
				"documents": [
				{
					"_id": "57977cc5d26ad1ec0e20bd7f",
					"created": Date.now(),
					"nombre": "Lenovo",
					"estado": 1,
					"user": "579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977cc5d26ad1ec0e20bd80",					
					"created": Date.now(),
					"nombre": "Samsung",
					"estado": 1,
					"user": "579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977cc5d26ad1ec0e20bd81",					
					"created": Date.now(),
					"nombre": "Casio",
					"estado": 1,
					"user": "579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977cc5d26ad1ec0e20bd82",				
					"created": Date.now(),
					"nombre": "Acer",
					"estado": 1,
					"user": "579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977cc5d26ad1ec0e20bd83",
					"created": Date.now(),
					"nombre": "Otros",
					"estado": 1,
					"user": "579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977cc5d26ad1ec0e20bd84",
					"created": Date.now(),
					"nombre": "Solbasta",
					"estado": 1,
					"user": "579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977cc5d26ad1ec0e20bd85",					
					"created": Date.now(),
					"nombre": "Paquetes",
					"estado": 1,
					"user": "579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977cc5d26ad1ec0e20bd86",								
					"created": Date.now(),
					"nombre": "Canon",
					"estado": 1,
					"user": "579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977cc5d26ad1ec0e20bd87",					
					"created": Date.now(),
					"nombre": "AOC",
					"estado": 1,
					"user": "579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977cc5d26ad1ec0e20bd88",					
					"created": Date.now(),
					"nombre": "LG",
					"estado": 1,
					"user": "579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977cc5d26ad1ec0e20bd89",					
					"created": Date.now(),
					"nombre": "Sony",
					"estado": 1,
					"user": "579a95c527fc04b8013c3ebd"
				}
				]
			},
			{
				"model": "Producto",
				"documents": [
				{
					"_id": "57977ec07d0b67e41585cf96",
					"nombre": "Lenovo Tab3 7 Essential 8 GB (Negro)",
					"precio_normal": 180,
					"precio_oferta": 349,
					"nombre_display":"Lenovo Tab3 7 Essential 8 GB (Negro)",
					"descripcion_larga":"Lenovo Tab3 7 Essential 8 GB (Negro)",
					"descripcion_corta":"Lenovo Tab3 7 Essential 8 GB (Negro)",
					"categoria": "57977bdc302029f8167ebc63",
					"marca": "57977cc5d26ad1ec0e20bd7f",
					"tags" : "Lenovo,celular",
					"imagenUrl":"modules/productos/client/img/5f68ee56723906179eb7f2f1ec67855e8f748a48.jpg",
					"thumbnail": "modules/productos/client/img/5f68ee56723906179eb7f2f1ec67855e8f748a48.jpg",
					"created": Date.now(),
					"updated": Date.now(),
					"deleted":"",
					"user":"579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977ec07d0b67e41585cf97",					
					"nombre": "Samsung Galaxy S7 Edge SM-G935F 32GB (Negro)",
					"precio_normal": 2000,
					"precio_oferta": 3500,
					"nombre_display": "Samsung Galaxy S7 Edge SM-G935F 32GB (Negro)",
					"descripcion_larga":"Samsung Galaxy S7 Edge SM-G935F 32GB (Negro)",
					"descripcion_corta":"Samsung Galaxy S7 Edge SM-G935F 32GB (Negro)",
					"categoria": "57977bdc302029f8167ebc63",
					"marca": "57977cc5d26ad1ec0e20bd7f",
					"tags" : "Sansung,Galaxy,S7",
					"imagenUrl":"modules/productos/client/img/327ccce16a2760be0f8c86c6b5f5e1be1ad8a82f.jpg",
					"thumbnail": "modules/productos/client/img/327ccce16a2760be0f8c86c6b5f5e1be1ad8a82f.jpg",
					"created": Date.now(),
					"updated": Date.now(),
					"deleted":"",
					"user":"579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977ec07d0b67e41585cf98",					
					"nombre": "Reloj Casio G-Shock DW-9052-1VH (Negro)",
					"precio_normal": 200,
					"precio_oferta": 499,
					"nombre_display": "Reloj Casio G-Shock DW-9052-1VH (Negro)",
					"descripcion_larga":"Reloj Casio G-Shock DW-9052-1VH (Negro)",
					"descripcion_corta":"Reloj Casio G-Shock DW-9052-1VH (Negro)",
					"categoria": "57977bdc302029f8167ebc63",
					"marca": "57977cc5d26ad1ec0e20bd7f",
					"tags" : "Reloj, casio",
					"imagenUrl":"modules/productos/client/img/9b83d4e924a0e4ae3845755d55491b575112b770.jpg",
					"thumbnail": "modules/productos/client/img/9b83d4e924a0e4ae3845755d55491b575112b770.jpg",
					"created": Date.now(),
					"updated": Date.now(),
					"deleted":"",
					"user":"579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977ec07d0b67e41585cf99",					
					"nombre": "Samsung Audífono Bluetooth Level U (Negro azulado)",
					"precio_normal": 100,
					"precio_oferta": 350,
					"nombre_display": "Samsung Audífono Bluetooth Level U (Negro azulado)",
					"descripcion_larga": "Samsung Audífono Bluetooth Level U (Negro azulado)",
					"descripcion_corta": "Samsung Audífono Bluetooth Level U (Negro azulado)",
					"categoria": "57977bdc302029f8167ebc63",
					"marca": "57977cc5d26ad1ec0e20bd7f",
					"tags" : "Samsung,audifono",
					"imagenUrl":"modules/productos/client/img/ae434d27961c8c93b444a2f6f29a6a892e8c345e.jpg",
					"thumbnail": "modules/productos/client/img/ae434d27961c8c93b444a2f6f29a6a892e8c345e.jpg",
					"created": Date.now(),
					"updated": Date.now(),
					"deleted":"",
					"user":"579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977ec07d0b67e41585cf9a",					
					"nombre": "Tarjeta Steam Card $20 (Código Virtual)",
					"precio_normal": 40,
					"precio_oferta": 79,
					"nombre_display": "Tarjeta Steam Card $20 (Código Virtual)",
					"descripcion_larga":"Tarjeta Steam Card $20 (Código Virtual)",
					"descripcion_corta":"Tarjeta Steam Card $20 (Código Virtual)",
					"categoria": "57977bdc302029f8167ebc64",
					"marca": "57977cc5d26ad1ec0e20bd7f",
					"tags" : "Steam,card",
					"imagenUrl":"modules/productos/client/img/44389f9b4b491c2be0dec97f266f43533fd1365a.JPG",
					"thumbnail": "modules/productos/client/img/44389f9b4b491c2be0dec97f266f43533fd1365a.JPG",
					"created": Date.now(),
					"updated": Date.now(),
					"deleted":"",
					"user":"579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977ec07d0b67e41585cf9b",					
					"nombre": "Acer Notebook 14' Intel Core i5 4 GB 1 TB (Iron)",
					"precio_normal": 1000,
					"precio_oferta": 1799,
					"nombre_display":"Acer Notebook 14' Intel Core i5 4 GB 1 TB (Iron)",
					"descripcion_larga":"Acer Notebook 14' Intel Core i5 4 GB 1 TB (Iron)",
					"descripcion_corta":"Acer Notebook 14' Intel Core i5 4 GB 1 TB (Iron)",
					"categoria": "57977bdc302029f8167ebc63",
					"marca": "57977cc5d26ad1ec0e20bd7f",
					"tags" : "Acer,Notebook,I5",
					"imagenUrl":"modules/productos/client/img/0a68eb071f6ca4722124d7ece69945e23540f3b7.jpg",
					"thumbnail": "modules/productos/client/img/0a68eb071f6ca4722124d7ece69945e23540f3b7.jpg",
					"created": Date.now(),
					"updated": Date.now(),
					"deleted":"",
					"user":"579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977ec07d0b67e41585cf9c",					
					"nombre": "Sony PlayStation Vita (Wi-Fi)",
					"precio_normal":500,
					"precio_oferta": 899,
					"nombre_display": "Sony PlayStation Vita (Wi-Fi)",
					"descripcion_larga":"Sony PlayStation Vita (Wi-Fi)",
					"descripcion_corta":"Sony PlayStation Vita (Wi-Fi)",
					"categoria": "57977bdc302029f8167ebc64",
					"marca": "57977cc5d26ad1ec0e20bd7f",
					"tags" : "Sony,PS,Vita",
					"imagenUrl":"modules/productos/client/img/9e3039291076cc22d2c1dfb673f6edaf4cf46a38.jpg",
					"thumbnail": "modules/productos/client/img/9e3039291076cc22d2c1dfb673f6edaf4cf46a38.jpg",
					"created": Date.now(),
					"updated": Date.now(),
					"deleted":"",
					"user":"579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977ec07d0b67e41585cf9d",					
					"nombre": "CORSAIR MOUSEPAD DE TELA ANTIDESGASTE CORSAIR GAMING MM300 (EXTENDED EDITION)",
					"precio_normal": 80,
					"precio_oferta": 120,
					"nombre_display": "CORSAIR MOUSEPAD DE TELA ANTIDESGASTE CORSAIR GAMING MM300 (EXTENDED EDITION)",
					"descripcion_larga":"CORSAIR MOUSEPAD DE TELA ANTIDESGASTE CORSAIR GAMING MM300 (EXTENDED EDITION)",
					"descripcion_corta":"CORSAIR MOUSEPAD DE TELA ANTIDESGASTE CORSAIR GAMING MM300 (EXTENDED EDITION)",
					"categoria": "57977bdc302029f8167ebc64",
					"marca": "57977cc5d26ad1ec0e20bd7f",
					"tags" : "corsair,mousepad,otros",
					"imagenUrl":"modules/productos/client/img/5ab08a5ff4cc2052aa08072bc0624372db3bb4f4.png",
					"thumbnail": "modules/productos/client/img/5ab08a5ff4cc2052aa08072bc0624372db3bb4f4.png",
					"created": Date.now(),
					"updated": Date.now(),
					"deleted":"",
					"user":"579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977ec07d0b67e41585cf9e",					
					"nombre": "CM STORM OCTANE GAMING COMBO TECLADO CON RETROILUMINACIÓN + MOUSE CON SENSOR ÓPTICO 3500 DPI",
					"precio_normal": 100,
					"precio_oferta": 239,
					"nombre_display": "CM STORM OCTANE GAMING COMBO TECLADO CON RETROILUMINACIÓN + MOUSE CON SENSOR ÓPTICO 3500 DPI",
					"descripcion_larga":"CM STORM OCTANE GAMING COMBO TECLADO CON RETROILUMINACIÓN + MOUSE CON SENSOR ÓPTICO 3500 DPI",
					"descripcion_corta":"CM STORM OCTANE GAMING COMBO TECLADO CON RETROILUMINACIÓN + MOUSE CON SENSOR ÓPTICO 3500 DPI",
					"categoria": "57977bdc302029f8167ebc64",
					"marca": "57977cc5d26ad1ec0e20bd7f",
					"tags" : "Teclado,octane",
					"imagenUrl":"modules/productos/client/img/893b8907804cf5db496a821adf3b500485644215.jpg",
					"thumbnail": "modules/productos/client/img/893b8907804cf5db496a821adf3b500485644215.jpg",
					"created": Date.now(),
					"updated": Date.now(),
					"deleted":"",
					"user":"579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977ec07d0b67e41585cf9f",					
					"nombre": "Hori Control Fighting Commander 4 PS3-PS4",
					"precio_normal": 200,
					"precio_oferta": 219,
					"nombre_display": "Hori Control Fighting Commander 4 PS3-PS4",
					"descripcion_larga":"Hori Control Fighting Commander 4 PS3-PS4",
					"descripcion_corta":"Hori Control Fighting Commander 4 PS3-PS4",
					"categoria": "57977bdc302029f8167ebc64",
					"marca": "57977cc5d26ad1ec0e20bd7f",
					"tags" : "Hori,Control",
					"imagenUrl":"modules/productos/client/img/a16eb601449ffab23d2a186350ae976d03fbd99e.jpg",
					"thumbnail": "modules/productos/client/img/a16eb601449ffab23d2a186350ae976d03fbd99e.jpg",
					"created": Date.now(),
					"updated": Date.now(),
					"deleted":"",
					"user":"579a95c527fc04b8013c3ebd"
				},
				{
					"_id": "57977ec07d0b67e41585cfa0",					
					"nombre": "Audífonos Skullcandy Ink'd Con Micrófono (Negro)",
					"precio_normal": 50,
					"precio_oferta": 99,
					"nombre_display": "Audífonos Skullcandy Ink'd Con Micrófono (Negro)",
					"descripcion_larga": "Audífonos Skullcandy Ink'd Con Micrófono (Negro)",
					"descripcion_corta": "Audífonos Skullcandy Ink'd Con Micrófono (Negro)",
					"categoria": "57977bdc302029f8167ebc64",
					"marca": "57977cc5d26ad1ec0e20bd7f",
					"tags" : "Skull,Candy,Headphones",
					"imagenUrl":"modules/productos/client/img/0aec00b5bc852a2308ce4eab25cc332c6262a387.jpg",
					"thumbnail": "modules/productos/client/img/0aec00b5bc852a2308ce4eab25cc332c6262a387.jpg",
					"created": Date.now(),
					"updated": Date.now(),
					"deleted":"",
					"user":"579a95c527fc04b8013c3ebd"
				},

				]
			},
			
			{
			    "model": "Detalle_subasta",
			    "documents": [
			        {
			            "titulo"	: "Lenovo Tab3 7 Essential 8 GB (Negro)",
			            "descripcion": "Trabaje, juegue o simplemente teclee a distancia en la elegante pantalla IPS de alta resolución (1024 x 600) de 7 pulgadas del Tab3 7 Essential. La tecnología IPS hace que sea fácil compartir lo que está viendo con sus amigos, y con una pantalla táctil de alta transparencia y ultradelgada, todas las imágenes parecen más cercanas, claras y nítidas.",
			            "fecha_inicio":  moment().add(-5, 'hours').add(15, 'seconds').add(1, 'days'),
						"fecha_fin":"2016-08-04",
			            "shipping": true,
			            "estado": 2,
			            "destacado": false,
			            "created_at": Date.now(),
			            "updated_at": Date.now(),
			            "producto": "5823ae1b65512354115f31b0",
			            "tipos": {
					      "menosveinte": false,
					      "cumpleanero": false,
					      "estandar": true,
					      "novato": false,
					      "revancha": false,
					      "rapidita": false
						 },
			            "user": "58254389eb84880417e610a4",
			        }
			    ]
			}

];

