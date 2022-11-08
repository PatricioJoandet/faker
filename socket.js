const {Server} = require("socket.io");
const {Productos, Mensajes} = require("./db/database.js")

let io;

const initServer = (httpServer) => {
    io = new Server(httpServer);
    setEvents(io)
}

const setEvents = (io) => {

    const ProductosDB = new Productos();
    ProductosDB.crearTabla();
    const MensajesDB = new Mensajes();
    MensajesDB.crearTabla();

    io.on("connection", async (socketClient) => {
        console.log("Nuevo cliente, id: " + socketClient.id);

        console.log(await ProductosDB.conseguirData())
        if (await ProductosDB.conseguirData().length !== 0){
            emit("product-history", await ProductosDB.conseguirData())
        }
        
        console.log(await MensajesDB.conseguirData())
        if (await MensajesDB.conseguirData().length !== 0){
            emit("message-history", await MensajesDB.conseguirData())
        }

        socketClient.on("disconnection", () => {
            console.log("Se ha desconectado el cliente con la id " + socketClient.id);
        })

        socketClient.on("product", async (data) => {
            await ProductosDB.añadirData(data)
            emit("product", await ProductosDB.conseguirData())
        })

        socketClient.on("message", async (data) => {
            await MensajesDB.añadirData(data)
            emit("message", await MensajesDB.conseguirData())
        })
    }) 
    
} 

const emit = (action, data) => {
    io.emit(action, data)
}

module.exports = {
    initServer,
    emit
}