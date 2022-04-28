//Importar a los modulos
const express = require("express");
const expressFileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

//Crear el servidor
app.listen(3000, () => {
  console.log("server en el puerto 3000");
});

//definir la carpeta public y el body-parser
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false })); //false ya que no solamente trabajaremos con "cadenas"
app.use(bodyParser.json());

//configuración basica para la subida de archivos
app.use(
  expressFileUpload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: "Archivo pesa demasiado",
  })
);

//ruta raíz con el formulario
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/formulario.html");
});

//ruta para el collage
app.get("/collage", (req, res) => {
  res.sendFile(__dirname + "/public/collage.html");
});

//ruta post para la subida de archivos
app.post("/imagen", (req, res) => {
  const target_file = req.files.target_file;
  const { posicion } = req.body;
  target_file.mv(`${__dirname}/public/imgs/imagen-${posicion}.jpg`, (err) => {
    if (err) throw err;
    res.redirect("/collage");
  });
});

//ruta para la eliminación de archivos
app.get("/deleteImg/:imagenName", (req, res) => {
  let imagenName = req.params.imagenName;
  fs.unlink(`public/imgs/${imagenName}`, (err) => {
    if (err) throw err + "Llorar D:";
    res.send(`el archivo ${imagenName} fue eliminado , <a href="/">Subir otra imagen</a>`)
  });
});
