const express = require('express');
const { Router } = express;

const fakerJs = require('@faker-js/faker');
const { faker } = fakerJs;

faker.locale = 'es';

const products = Router();

products.get('/', (req, res, next) => {
  try{
    let data = {productos: []};
    for(let i = 0; i<5; i++){
      data.productos.push({
        nombre: faker.commerce.product(),
        precio: faker.commerce.price(),
        url: faker.image.food(),
      })
    }
    res.render("products", data);
  } catch(error){
      next(error)
  }
})

module.exports = products;