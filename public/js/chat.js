const url = (window.location.hostname.includes('localhost'))
  ? 'http://localhost:3002/api/auth/'
  : 'https://jlpj-node-rest-server.herokuapp.com/api/auth/';

let usuario = null;
let socket = null;

// Referencia HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

const validarJWT = async() => {
  const token = localStorage.getItem('token') || '';
  if (!token) {
    window.location = 'index.html';
    throw new Error('No hay token');
  }

  const resp = await fetch(url, {
    headers: {'x-token': token }
  });

  const { usuario: userDB, token: tokenDB } = await resp.json();
  localStorage.setItem('token', tokenDB);
  usuario = userDB;
  document.title = usuario.nombre;

  await conectarSocket(token);
}

const conectarSocket = async(token) => {
  socket = io({
    'extraHeaders': {
      'x-token': token
    }
  });

  socket.on('connect', () => console.log('Socket online'));
  socket.on('disconnect', () => console.log('Socket offline'));

  socket.on('recibir-mensajes', dibujarMensajes);
  socket.on('usuarios-activos', dibujarUsuarios);

  socket.on('mensaje-privado', (payload) => {
    console.log('Privado', payload)
  });
}


const dibujarUsuarios = (usuarios = []) => {
  let usersHTML = '';
  usuarios.forEach( user => {
    usersHTML += `
      <li>
        <p>
          <h5 class="text-success">${user.nombre}</h5>
          <span class="fs-6 text-muted">${user.uid}</span>

        </p>
      </li>
    `;
  });
  ulUsuarios.innerHTML = usersHTML;
}

const dibujarMensajes = (mensajes = []) => {
  let mensajesHTML = '';
  mensajes.forEach( ({nombre, mensaje}) => {
    mensajesHTML += `
      <li>
        <p>
          <span class="text-primary">${nombre}:</span>
          <span>${mensaje}</span>

        </p>
      </li>
    `;
  });
  ulMensajes.innerHTML = mensajesHTML;
}

txtMensaje.addEventListener('keyup', ({keyCode}) => {
  const mensaje = txtMensaje.value;
  const uid = txtUid.value;
  if (keyCode !== 13) { return; }
  if (mensaje.length === 0) { return; }

  socket.emit('enviar-mensaje', { mensaje, uid });
  txtMensaje.value = '';
});

const main = async() => {
  await validarJWT()
}

main();
