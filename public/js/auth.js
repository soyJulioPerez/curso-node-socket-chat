const miFormulario = document.querySelector('form');

const url = (window.location.hostname.includes('localhost'))
  ? 'http://localhost:3002/api/auth/'
  : 'https://jlpj-node-rest-server.herokuapp.com/api/auth/';

miFormulario.addEventListener('submit', ev => {
  ev.preventDefault();
  const formData = {};
  for (const el of miFormulario.elements) {
    if (el.namespaceURI.length > 0) {
      formData[el.name] = el.value;
    }
  }

  fetch(url + 'login', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'application/json'}
  })
  .then( resp => resp.json())
  .then( ({msg, token}) => {
    if (msg) { return console.error(msg); }
    localStorage.setItem('token', token);
    window.location = 'chat.html';
  })
  .catch( err => console.log(err))
});

function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  // var profile = googleUser.getBasicProfile();
  // console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  // console.log('Full Name: ' + profile.getName());
  // console.log('Given Name: ' + profile.getGivenName());
  // console.log('Family Name: ' + profile.getFamilyName());
  // console.log("Image URL: " + profile.getImageUrl());
  // console.log("Email: " + profile.getEmail());

  // The ID token you need to pass to your backend:
  const id_token = googleUser.getAuthResponse().id_token;
  const data = { id_token };
  fetch(url + 'google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(({token}) => {
      localStorage.setItem('token', token);
      window.location = 'chat.html';
    })
    .catch(console.log);
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}
