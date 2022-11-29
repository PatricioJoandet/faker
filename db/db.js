const mongoose = require('mongoose');
const { Schema } = mongoose
require('dotenv').config();
mongoose.connect(process.env.MONGO_URL);

class DB {
  constructor(schema){
    this.schema = schema;
  }

  async getData(){
    try {
      return await this.schema.find({})
    } catch (error) {
      console.log("Error al buscar data")
    }
  }

  async newData(data){
    try {
      const res = await this.schema(data).save();
      return res;
    } catch (error) {
      console.log("Error al guardar data")
    }
  }

}
class Mensajes extends DB{
  constructor(){
    super(
      mongoose.model("mensajes", {
        author: {
          id: { type: String, required: true },
          nombre: { type: String, required: true },
          apellido: { type: String, required: true },
          edad: { type: Number, required: true },
          alias: { type: String, required: true },
          avatar: { type: String, required: true },
        },
        text: { type: String, required: true },
      })
    )
  }

  async addMsg(message){
    await super.newData(message);
  }

  async getMsgs(){
    return await super.getData();
  }
}

class Productos extends DB{
  constructor(){
    super(
      mongoose.model("productos", {
        nombre: { type: String, required: true },
        precio: { type: Number, required: true },
        url: { type: String, required: true },
      })
    );
  }

  async addProduct(product){
    await super.newData(product);
  }
  
  async getProducts(){
    return await super.getData();
  }
}

module.exports= { Productos, Mensajes }


