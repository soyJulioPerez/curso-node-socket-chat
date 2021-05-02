const path = require('path')
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( archivo, carpeta = '', extensionesValidas = ['bmp', 'jpg', 'jepg', 'png'] ) => {
  return new Promise((resolve, reject) => {
    const extension = archivo.name.split('.').pop()
    if (!extensionesValidas.includes(extension)) {
      return reject(`Extensión cargada: ${extension} Extensiones permitidas: ${extensionesValidas}`);
    }

    const fileName = archivo.name + '.' + uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname, '../uploads/', carpeta, fileName);

    archivo.mv(uploadPath, err => {
      if (err) { return reject(err); }
      resolve(fileName);
    });
  });

}

module.exports = {
  subirArchivo
}
