import { Server } from "socket.io"
import { Productos, Mensajes } from "./db/db.js";

let io;

const initServer = (httpServer) => {
    io = new Server(httpServer);
    setEvents(io)
}

const setEvents = (io) => {
    const ProductosDB = new Productos();
    const MensajesDB = new Mensajes();

    io.on("connection", async (socketClient) => {
        console.log("Nuevo cliente, id: " + socketClient.id);
        console.log(await ProductosDB.getProducts())
        if (await ProductosDB.getProducts().length !== 0){
            emit("product-history", await ProductosDB.getProducts())
        }
        
        console.log(await MensajesDB.getMsgs())
        if (await MensajesDB.getMsgs().length !== 0){
            emit("message-history", await MensajesDB.getMsgs())
        }

        socketClient.on("disconnection", () => {
            console.log("Se ha desconectado el cliente con la id " + socketClient.id);
        })

        socketClient.on("product", async (data) => {
            await ProductosDB.addProduct(data)
            emit("product", await ProductosDB.getProducts())
        })

        socketClient.on("message", async (data) => {
            await MensajesDB.addMsg(data)
            emit("message", await MensajesDB.getMsgs())
        })
    }) 
    
} 

const emit = (action, data) => {
    io.emit(action, data)
}

export {
    initServer,
    emit
}