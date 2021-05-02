const { request, response } = require('express');
const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');

const cargarArchivo = async(req =request, res = response) => {
  try {
    const fileName = await subirArchivo(req.files.archivo, 'imgs', ['bmp', 'jpg', 'jepg', 'png', 'pdf']);
    res.json({ fileName });

  } catch (error) {
    res.status(400).json({ msg: error });
  }

}

const actualizarImagen = async(req =request, res = response) => {
  const { coleccion, id } = req.params;
  let modelo;
  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el ID ${id}`
        });
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el ID ${id}`
        });
      }
    break;

    default:
      return res.status(500).json({msg: 'Se me olvidó validar esto'});
    break;
  }

  try {
    // Limpiar imagenes previas
    if (modelo.img) {
      const pathImagen = path.join(__dirname, '../uploads/', coleccion, modelo.img);
      if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen)
      }
    }

    modelo.img = await subirArchivo(req.files.archivo, coleccion, ['bmp', 'jpg', 'jepg', 'png', 'pdf']);
    await modelo.save();
    res.json({ modelo });

  } catch (error) {
    res.status(400).json({ msg: error });
  }

}

const recuperarImagen = async(req = request, res = response) => {
  const { coleccion, id } = req.params;
  let modelo;
  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el ID ${id}`
        });
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el ID ${id}`
        });
      }
    break;

    default:
      return res.status(500).json({msg: 'Se me olvidó validar esto'});
    break;
  }

  try {
    if (modelo.img) {
      const pathImagen = path.join(__dirname, '../uploads/', coleccion, modelo.img);
      if (fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen)
      }
    }

    const pathImagen = path.join(__dirname, '../assets/', '', 'no-image.jpg');
    res.sendFile(pathImagen)
  } catch (error) {
    res.status(400).json({ msg: error });
  }
}


const actualizarImagenCloudinary = async(req =request, res = response) => {
  const { coleccion, id } = req.params;
  let modelo;
  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el ID ${id}`
        });
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el ID ${id}`
        });
      }
    break;

    default:
      return res.status(500).json({msg: 'Se me olvidó validar esto'});
    break;
  }

  try {
    if (modelo.img) {
      const fileName = modelo.img.split('/').pop();
      const [public_id ] = fileName.split('.');
      cloudinary.uploader.destroy(public_id);
    }
    const { secure_url } = await cloudinary.uploader.upload(req.files.archivo.tempFilePath);

    modelo.img = secure_url;
    await modelo.save();
    res.json({ modelo });

  } catch (error) {
    res.status(400).json({ msg: error });
  }

}

module.exports = {
  cargarArchivo,
  actualizarImagen,
  recuperarImagen,
  actualizarImagenCloudinary
}
