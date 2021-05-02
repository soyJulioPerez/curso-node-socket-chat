const url = (window.location.hostname.includes('localhost'))
  ? 'http://localhost:3002/api/auth/'
  : 'https://jlpj-node-rest-server.herokuapp.com/api/auth/';

let usuario = null;
let socket = null;

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
  const socket = io({
    'extraHeaders': {
      'x-token': token
    }
  });
}

const main = async() => {
  await validarJWT()
}

main();
