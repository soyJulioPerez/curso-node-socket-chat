const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes();
const socketController = async(socket, io) => {
  const usuario = await comprobarJWT(socket.handshake.headers['x-token'])
  if (!usuario) {
    return socket.disconnect();
  }

  chatMensajes.conectarUsuario(usuario);
  io.emit('usuarios-activos', chatMensajes.usuariosArr);
  socket.emit('recibir-mensajes', chatMensajes.ultimos10);

  socket.on('disconnect', () => {
    chatMensajes.desconectarUsuario(usuario.id);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
  });

  socket.on('enviar-mensaje', ({uid, mensaje}) => {
    chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
    io.emit('recibir-mensajes', chatMensajes.ultimos10);
  });

}

module.exports = {
  socketController
}
