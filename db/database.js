const knex = require("knex")
const { mariadbOptions, sqliteOptions } = require("./dbOptions")

class DB {
    constructor(options, table){
        this.options = options
        this.table = table
    }
    
    async iniciarInstancia(){
        try {
            this.instance = knex(this.options); 
        } catch (error) {
            console.log("Error:" + error)
        }
    }

    async destruirInstancia(){
        try {
            await this.instance.destroy()
        } catch (error) {
           console.log("Error:" + error) 
        }
    }

    async verificarTabla(nombreTabla){
        return await this.instance.schema.hasTable(nombreTabla)
    }

    async crearTabla(fnTabla){
        try {
            this.iniciarInstancia();
            if(!(await this.verificarTabla(this.table)))
                await this.instance.schema.createTable(this.table, fnTabla);
        } catch (error) {
            console.log("Error: " + this.table + "\n" + error)
        } finally {
            this.destruirInstancia();
        }
    }

    async conseguirData(){
        let data;
        try {
            this.iniciarInstancia();
            if(await this.verificarTabla(this.table))
                data = await this.instance(this.table).select();
        } catch (error) {
            console.log("Error:" + this.table + "\n" + error)
            throw Error("error")
        } finally {
            this.destruirInstancia();
            return data
        }
    }

    async añadirData(data){
        try {
            this.iniciarInstancia();
            if(await this.verificarTabla(this.table))
                await this.instance(this.table).insert(data);
        } catch (error) {
            console.log("Error:" + this.table + "\n" + error)
            throw Error("error")
        } finally {
            this.destruirInstancia();
        }
    }
}

class Productos extends DB {
    constructor(){
        super(mariadbOptions, "productos")
    }

    async crearTabla(){
        await super.crearTabla((table) => {
            table.increments("id");
            table.string("nombre", 40);
            table.integer("precio");
            table.string("url", 80);
        })
    }
}

class Mensajes extends DB {
    constructor(){
        super(sqliteOptions, "mensajes")
    }

    async crearTabla(){
        await super.crearTabla((table) => {
            table.increments("id");
            table.string("email", 40);
            table.string("message", 80);
            table.timestamp("timestamp").defaultTo(this.instance.fn.now());
        })
    }
}

module.exports = {
    Productos,
    Mensajes
}