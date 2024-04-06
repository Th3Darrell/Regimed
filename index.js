const bcrypt = require("bcrypt");
const crypto = require("crypto");
const express = require("express");
const session = require("express-session");
const path = require("path");
const mysql = require("mysql");
const uuid = require("uuid");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
// const pg = require ('pg')
const dotenv = require ('dotenv')

dotenv.config()

const app = express();

// const pool = new pg.Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: true
// })

// app.get ('/ping', async (req, res) => {
//   const result = await pool.query('SELECT NOW()')
//   return res.json(result.rows[0])
// })

function generarClaveSecreta() {
  return crypto.randomBytes(32).toString("hex");
}

const claveSecreta = generarClaveSecreta();

app.use(
  session({
    secret: claveSecreta,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

let conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "views")));

const transporter = nodemailer.createTransport({
  host: "smtp.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: "service@regimed.org",
    pass: "Ori-regimed.3312!",
  },
});

function generarToken(usuario_id) {
  return jwt.sign({ usuario_id }, "secreto", {
    expiresIn: "1d",
    issuer: "regimed.org",
  });
}

function enviarCorreoVerificacion(correo, token) {
  const mailOptions = {
    from: "service@regimed.org",
    to: correo,
    subject: "Verifica tu dirección de correo electrónico",
    html: `
    <!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
<meta charset="utf-8" />
<meta content="width=device-width" name="viewport" />
<meta content="IE=edge" http-equiv="X-UA-Compatible" />
<meta name="x-apple-disable-message-reformatting" />
<meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection" />
<title>Frame 27</title>
<!--[if mso]>
            <style>
                * {
                    font-family: sans-serif !important;
                }
            </style>
        <![endif]-->
<!--[if !mso]><!-->
<!-- <![endif]-->
<link href="https://fonts.googleapis.com/css?family=Roboto:400" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/css?family=Roboto:600" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/css?family=Inter:700" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/css?family=Roboto:700" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/css?family=Inter:400" rel="stylesheet" type="text/css">
<style>
html {
    margin: 0 !important;
    padding: 0 !important;
}

* {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
}
td {
    vertical-align: top;
    mso-table-lspace: 0pt !important;
    mso-table-rspace: 0pt !important;
}
a {
    text-decoration: none;
}
img {
    -ms-interpolation-mode:bicubic;
}
@media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
    u ~ div .email-container {
        min-width: 320px !important;
    }
}
@media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
    u ~ div .email-container {
        min-width: 375px !important;
    }
}
@media only screen and (min-device-width: 414px) {
    u ~ div .email-container {
        min-width: 414px !important;
    }
}

</style>
<!--[if gte mso 9]>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
<style>
@media only screen and (max-device-width: 699px), only screen and (max-width: 699px) {

    .eh {
        height:auto !important;
    }
    .desktop {
        display: none !important;
        height: 0 !important;
        margin: 0 !important;
        max-height: 0 !important;
        overflow: hidden !important;
        padding: 0 !important;
        visibility: hidden !important;
        width: 0 !important;
    }
    .mobile {
        display: block !important;
        width: auto !important;
        height: auto !important;
        float: none !important;
    }
    .email-container {
        width: 100% !important;
        margin: auto !important;
    }
    .stack-column,
    .stack-column-center {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        direction: ltr !important;
    }
    .wid-auto {
        width:auto !important;
    }

    .table-w-full-mobile {
        width: 100%;
    }

    .text-44268512 {font-size:24px !important;}
    

    .mobile-center {
        text-align: center;
    }

    .mobile-center > table {
        display: inline-block;
        vertical-align: inherit;
    }

    .mobile-left {
        text-align: left;
    }

    .mobile-left > table {
        display: inline-block;
        vertical-align: inherit;
    }

    .mobile-right {
        text-align: right;
    }

    .mobile-right > table {
        display: inline-block;
        vertical-align: inherit;
    }

}

</style>
</head>

<body width="100%" style="background-color:#f5f5f5;margin:0;padding:0!important;mso-line-height-rule:exactly;">
<div style="background-color:#f5f5f5">
<!--[if gte mso 9]>
                <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                <v:fill type="tile" color="#f5f5f5"/>
                </v:background>
                <![endif]-->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td valign="top" align="center">
<table bgcolor="#ffffff" style="margin:0 auto;" align="center" id="brick_container" cellspacing="0" cellpadding="0" border="0" width="700" class="email-container">
<tr>
<td width="700">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td width="700">
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td width="680" align="center" style="vertical-align: middle; background-color:#254271;   padding-left:10px; padding-right:10px;" bgcolor="#254271">
<table border="0" cellpadding="0" cellspacing="0">
<tr>
<td height="10" style="height:10px; min-height:10px; line-height:10px;"></td>
</tr>
<tr>
<td style="vertical-align: middle;" align="center">
<div style="line-height:normal;text-align:left;"><span style="color:#ffffff;font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:normal;text-align:left;">Una vida al alcance de tus manos.</span></div>
</td>
</tr>
<tr>
<td height="10" style="height:10px; min-height:10px; line-height:10px;"></td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td width="700">
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td width="600" align="center" style="background-color:#ddecf1;   padding-left:50px; padding-right:50px;" bgcolor="#ddecf1">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td height="20" style="height:20px; min-height:20px; line-height:20px;"></td>
</tr>
<tr>
<td align="center">
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td width="156" align="center"><img src="https://plugin.markaimg.com/public/e2c7dcce/EClUR6HHWTsAdXX5cEsNnb3m8zqJjN.png" width="156" border="0" style="min-width:156px; width:156px;
         height: auto; display: block;"></td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="30" style="height:30px; min-height:30px; line-height:30px;"></td>
</tr>
<tr>
<td width="100%">
<table width="100%" cellspacing="0" cellpadding="0" border="0">
<tr>
<td width="100%" style="background-color:#ffffff; border-radius:20px;  padding-left:30px; padding-right:30px;" bgcolor="#ffffff">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td height="50" style="height:50px; min-height:50px; line-height:50px;"></td>
</tr>
<tr>
<td>
<div style="line-height:normal;text-align:left;"><span class="text-44268512" style="color:#254271;font-weight:600;font-family:Roboto,Arial,sans-serif;font-size:24px;line-height:normal;text-align:left;">Verifica tu dirección de email</span></div>
</td>
</tr>
<tr>
<td height="30" style="height:30px; min-height:30px; line-height:30px;"></td>
</tr>
<tr>
<td width="100%">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td>
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td>
<div style="line-height:normal;text-align:left;"><span style="color:#254271;font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:normal;text-align:left;">Haz clic en el botón de abajo para verificar tu dirección de email.</span></div>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="20" style="height:20px; min-height:20px; line-height:20px;"></td>
</tr>
<tr>
<td width="100%" style="vertical-align: middle; height:45px;  ">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td>
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td style="vertical-align: middle;">
<div>
<!--[if mso]>
                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="#" style="height:45px;v-text-anchor:middle;width:147px;" fillcolor="#00a3ff"  stroke="f" >
                        <w:anchorlock/>
                        <center style="white-space:nowrap;display:inline-block;text-align:center;color:#ffffff;font-weight:700;font-family:Inter,Arial,sans-serif;font-size:14px;">Verificar email</center>
                        </v:roundrect>
                    <![endif]-->
<a href="https://regimed.org/verificar_correo?token=${token}" style="white-space:nowrap;background-color:#00a3ff; display:inline-block;text-align:center;color:#ffffff;font-weight:700;font-family:Inter,Arial,sans-serif;font-size:14px;line-height:45px;width:147px; -webkit-text-size-adjust:none;mso-hide:all;box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.0430000014603138);">Verificar email</a>
</div>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="20" style="height:20px; min-height:20px; line-height:20px;"></td>
</tr>
<tr>
<td>
<div style="line-height:normal;text-align:left;"><span style="color:#254271;font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:normal;text-align:left;">Por favor, asegúrate de no compartir nunca este código con nadie.</span></div>
</td>
</tr>
<tr>
<td height="20" style="height:20px; min-height:20px; line-height:20px;"></td>
</tr>
<tr>
<td>
<div style="line-height:normal;text-align:left;"><span style="color:#254271;font-weight:700;font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:normal;text-align:left;">Nota:</span><span style="color:#254271;font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:normal;text-align:left;"> El enlace es válido durante 30 minutos</span></div>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="50" style="height:50px; min-height:50px; line-height:50px;"></td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="30" style="height:30px; min-height:30px; line-height:30px;"></td>
</tr>
<tr>
<td width="100%" align="center">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td width="100%" style="vertical-align: middle;   padding-left:30px; padding-right:30px;">
<table border="0" cellpadding="0" cellspacing="0">
<tr>
<td style="vertical-align: middle;" width="40"><img src="https://plugin.markaimg.com/public/e2c7dcce/sNBppuo83WQNGCv9RKXt7fzhR75GD9.png" width="40" border="0" style="min-width:40px; width:40px;
         height: auto; display: block;"></td>
</tr>
<tr>
<td height="15" style="height:15px; min-height:15px; line-height:15px;"></td>
</tr>
</table>
</td>
</tr>
<tr>
<td width="100%" style="  padding-left:30px; padding-right:30px;">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td style=" border-width: 1px 0px 0px 0px; border-color:#004073; border-style:solid;">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td height="15" style="height:15px; min-height:15px; line-height:15px;"></td>
</tr>
<tr>
<td width="540">
<div style="line-height:normal;text-align:left;"><span style="color:#004073;font-family:Inter,Arial,sans-serif;font-size:12px;line-height:normal;text-align:left;">Has recibido este email porque estás registrado en Regimed. Si tu no registraste este email, haz caso omiso a este mensaje.</span></div>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="20" style="height:20px; min-height:20px; line-height:20px;"></td>
</tr>
<tr>
<td width="540">
<div style="line-height:normal;text-align:left;"><span style="color:#004073;font-family:Inter,Arial,sans-serif;font-size:12px;line-height:normal;text-align:left;">Gracias,<br>El equipo de Regimed</span></div>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="40" style="height:40px; min-height:40px; line-height:40px;"></td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</div>
</body>

</html>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(
        "Error al enviar el correo electrónico de verificación:",
        error
      );
    } else {
      console.log("Correo electrónico de verificación enviado:", info.response);
    }
  });
}

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/registro", function (req, res) {
  if (!req.session.formData) {
    req.session.formData = {};
  }
  res.render("registro", { formData: req.session.formData });
});

app.get("/acceso", function (req, res) {
  res.render("acceso");
});

app.get("/principal", (req, res) => {
  res.render("principal");
});

app.post("/registro", function (req, res) {
  const datos = req.body;

  const nombre = datos.nombre.trim();
  const apellido_paterno = datos.apellido_paterno.trim();
  const apellido_materno = datos.apellido_materno.trim();
  const correo = datos.correo.trim();
  const contrasenia = datos.contrasenia.trim();
  const conf_contrasenia = datos.conf_contrasenia.trim();

  correoUsuario = correo;

  const saltRounds = 10;
  const formatoNombre = /^[a-zA-ZÁáÉéÍíÓóÚúÜü\s]*$/;
  const formatoCorreo = /^\S+@\S+\.\S+$/.test(correo);
  const longMinContraseña = 8;
  const longMaxContraseña = 30;
  const passWithMay = /[A-Z]/.test(contrasenia);
  const passWithMin = /[a-z]/.test(contrasenia);
  const passWithEsp = /[$&+,:;=?@#|'<>.^*()%!-]/.test(contrasenia);

  const hashCorreo = crypto.createHash("sha256");
  hashCorreo.update(correo);
  const correoHash = hashCorreo.digest("hex");

  const buscar =
    "SELECT * FROM registro_usuario WHERE correo = '" + correoHash + "'";

  conexion.query(buscar, function (err, row) {
    if (err) {
      throw err;
    } else if (row.length > 0) {
      req.session.formData = {
        nombre: nombre,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        correo: correo,
      };
      return res.render("registro", {
        error: "El correo ya está registrado.",
        errorField: "correo",
        formData: req.session.formData, // Agregado para mantener los datos del formulario
      });
    } else if (nombre === "") {
      req.session.formData = {
        nombre: nombre,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        correo: correo,
      };
      return res.render("registro", {
        error: "Por favor, ingrese su nombre.",
        errorField: "nombre",
        formData: req.session.formData, // Agregado para mantener los datos del formulario
      });
    } else if (!formatoNombre.test(nombre)) {
      req.session.formData = {
        nombre: nombre,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        correo: correo,
      };
      return res.render("registro", {
        error: "El nombre solo debe contener letras y espacios.",
        errorField: "nombre",
        formData: req.session.formData, // Agregado para mantener los datos del formulario
      });
    } else if (apellido_paterno === "") {
      req.session.formData = {
        nombre: nombre,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        correo: correo,
      };
      return res.render("registro", {
        error: "Por favor, ingrese su apellido paterno.",
        errorField: "apellido_paterno",
        formData: req.session.formData, // Agregado para mantener los datos del formulario
      });
    } else if (apellido_materno === "") {
      req.session.formData = {
        nombre: nombre,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        correo: correo,
      };
      return res.render("registro", {
        error: "Por favor, ingrese su apellido materno.",
        errorField: "apellido_materno",
        formData: req.session.formData, // Agregado para mantener los datos del formulario
      });
    } else if (
      !formatoNombre.test(apellido_paterno) ||
      !formatoNombre.test(apellido_materno)
    ) {
      req.session.formData = {
        nombre: nombre,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        correo: correo,
      };
      return res.render("registro", {
        error: "Los apellidos solo debe contener letras y espacios.",
        errorField: "apellido_paterno",
        formData: req.session.formData, // Agregado para mantener los datos del formulario
      });
    } else if (correo === "") {
      req.session.formData = {
        nombre: nombre,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        correo: correo,
      };
      return res.render("registro", {
        error: "Por favor, ingrese su correo.",
        errorField: "correo",
        formData: req.session.formData, // Agregado para mantener los datos del formulario
      });
    } else if (!formatoCorreo) {
      req.session.formData = {
        nombre: nombre,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        correo: correo,
      };
      return res.render("registro", {
        error: "El correo ingresado no tiene un formato válido.",
        errorField: "correo",
        formData: req.session.formData, // Agregado para mantener los datos del formulario
      });
    } else if (contrasenia === "") {
      req.session.formData = {
        nombre: nombre,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        correo: correo,
      };
      return res.render("registro", {
        error: "Por favor, ingresa una contraseña",
        errorField: "contrasenia",
        formData: req.session.formData, // Agregado para mantener los datos del formulario
      });
    } else if (
      contrasenia.length < longMinContraseña ||
      contrasenia.length > longMaxContraseña
    ) {
      req.session.formData = {
        nombre: nombre,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        correo: correo,
      };
      return res.render("registro", {
        error:
          "La contraseña debe tener entre " +
          longMinContraseña +
          " y " +
          longMaxContraseña +
          " caracteres.",
        errorField: "contrasenia",
        formData: req.session.formData, // Agregado para mantener los datos del formulario
      });
    } else if (!passWithMay || !passWithMin || !passWithEsp) {
      req.session.formData = {
        nombre: nombre,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        correo: correo,
      };
      return res.render("registro", {
        error:
          "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un carácter especial.",
        errorField: "contrasenia",
        formData: req.session.formData, // Agregado para mantener los datos del formulario
      });
    } else if (conf_contrasenia === "") {
      req.session.formData = {
        nombre: nombre,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        correo: correo,
      };
      return res.render("registro", {
        error: "Por favor, ingresa nuevamente la contraseña",
        errorField: "conf_contrasenia",
        formData: req.session.formData, // Agregado para mantener los datos del formulario
      });
    } else if (contrasenia !== conf_contrasenia) {
      req.session.formData = {
        nombre: nombre,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        correo: correo,
      };
      return res.render("registro", {
        error: "Las contraseñas no coinciden.",
        errorField: ["contrasenia", "conf_contrasenia"],
        formData: req.session.formData, // Agregado para mantener los datos del formulario
      });
    } else {
      bcrypt.hash(contrasenia, saltRounds, function (err, hash) {
        if (err) {
          console.error("Error al hashear la contraseña: ", err);
        } else {
          const contraseniaHash = hash;
          const uuidGen = uuid.v4();

          const hashUUID = crypto.createHash("sha256");
          hashUUID.update(uuidGen);
          const uuidHash = hashUUID.digest("hex");

          const token = generarToken(uuidHash);

          enviarCorreoVerificacion(correo, token);

          const guardarNoVerificado =
            "INSERT INTO usuarios_no_registrados (usuario_id, nombre, apellido_paterno, apellido_materno, correo, contrasenia) VALUES ('" +
            uuidHash +
            "', '" +
            nombre +
            "', '" +
            apellido_paterno +
            "', '" +
            apellido_materno +
            "', '" +
            correoHash +
            "', '" +
            contraseniaHash +
            "')";

          conexion.query(guardarNoVerificado, function (err) {
            if (err) {
              throw err;
            } else {
              res.redirect("/verificacion/" + correo);
            }
          });
        }
      });
    }
  });
});

app.get("/verificacion/:correo", (req, res) => {
  res.render("verificacion", { correo: req.params.correo })
})

app.listen(process.env.PORT, function () {
  console.log("Servidor activo: ", process.env.PORT);
});

app.get("/verificar_correo", function (req, res) {
  const token = req.query.token;

  jwt.verify(token, "secreto", function (err, decoded) {
    if (err) {
      console.log("Token inválido");
      res.send("Token inválido");
    } else {
      console.log("Token válido. Usuario verificado:", decoded.usuario_id);
      // Mover los datos del usuario de la tabla de usuarios no verificados a la tabla de usuarios verificados
      const moverUsuarioVerificado =
        "INSERT INTO registro_usuario SELECT * FROM usuarios_no_registrados WHERE usuario_id = '" +
        decoded.usuario_id +
        "';";

      const eliminarUsuarioNoVerificado =
        "DELETE FROM usuarios_no_registrados WHERE usuario_id = '" +
        decoded.usuario_id +
        "'";

      conexion.query(moverUsuarioVerificado, function (err) {
        if (err) {
          console.error("Error al mover usuario verificado: ", err);
          res.send("Error al mover usuario verificado");
        } else {
          // Después de mover los datos, eliminamos el usuario no verificado
          conexion.query(eliminarUsuarioNoVerificado, function (err) {
            if (err) {
              console.error("Error al eliminar usuario no verificado: ", err);
              res.send("Error al eliminar usuario no verificado");
            } else {
              res.redirect("/principal");
            }
          });
        }
      });
    }
  });
});
