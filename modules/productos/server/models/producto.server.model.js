'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Producto Schema
 */
var ProductoSchema = new Schema({
  nombre: {
    type: String,
    trim: true,
    required: 'El nombre es requerido'
  },
  codigo: {
    type: String,
    trim: true
  },
  precio_normal: {
    type: Number,
    default: 0
  },
  precio_oferta: {
    type: Number,
    default: 0
  },
  nombre_display: {
    type: String,
    default: 'NombreDefault'
  },
  descripcion_larga: {
    type: String,
    default: 'Descripcion Larga'
  },
  youtube_url: {
    type: String,
    default: ''
  },
  descripcion_corta: {
    type: String,
    default: 'Descripcion Corta'
  },
  especificaciones: {
    type: String,
    default: ''
  },
  categoria: {
    type: Schema.ObjectId,
    ref: 'Categoria',
    required: false
  },
  marca: {
    type: Schema.ObjectId,
    ref: 'Marca',
    required: false
  },
  tags: {
    type: String,
    default: 'tag1,tag2,tag3'
  },
  status: {
    type: Number,
    default: 1
  },
  subasta_slider1: {
    type: Schema.ObjectId,
    ref: 'Detalle_Subasta',
    required: false
  },
  subasta_slider2: {
    type: Schema.ObjectId,
    ref: 'Detalle_Subasta',
    required: false
  },
  subasta_slider3: {
    type: Schema.ObjectId,
    ref: 'Detalle_Subasta',
    required: false
  },
  subasta_slider4: {
    type: Schema.ObjectId,
    ref: 'Detalle_Subasta',
    required: false
  },
  imagenUrl: {
    type: String,
    default: 'https://www.coviran.es/productos/PublishingImages/productoscoviran_marcapropia.png'
  },
  imagenUrl_mobil: {
    type: String,
    required: false
  },
  thumbnail_1: {
    type: String,
    default: 'https://www.coviran.es/productos/PublishingImages/productoscoviran_marcapropia.png'
  },
  thumbnail_2: {
    type: String,
    default: 'https://www.coviran.es/productos/PublishingImages/productoscoviran_marcapropia.png'
  },
  thumbnail_3: {
    type: String,
    default: 'https://www.coviran.es/productos/PublishingImages/productoscoviran_marcapropia.png'
  },
  thumbnail_1_mobil: {
    type: String,
    required: false
  },
  thumbnail_2_mobil: {
    type: String,
    required: false
  },
  thumbnail_3_mobil: {
    type: String,
    required: false
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Producto', ProductoSchema);
