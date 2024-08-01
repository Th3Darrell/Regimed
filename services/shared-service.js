const { ejecutarConsulta } = require('../config/database');

async function registrarCodigo(idUsuario, codigo) {
  const query = `INSERT INTO codigos_temporales (usuario_id, codigo, hora_registro) VALUES (?, ?, NOW())`;
  await ejecutarConsulta(query, [idUsuario, codigo]);
}

async function consultarCodigo(idUsuario) {
  const query = `SELECT * FROM codigos_temporales WHERE usuario_id = ?`;
  return ejecutarConsulta(query, [idUsuario]);
}

async function consultarCodigoExistente(codigo) {
  const query = `SELECT * FROM codigos_temporales WHERE codigo = ?`;
  return ejecutarConsulta(query, [codigo]);
}

async function eliminarCodigo(idUsuario) {
  const query = `DELETE FROM codigos_temporales WHERE usuario_id = ?`;
  await ejecutarConsulta(query, [idUsuario]);
}

async function registrarCompartido(idUsuario, idUsuarioCompartido) {
  const query = `INSERT INTO registros_compartidos (usuario_id, usuarioCompartido_id) values (?, ?)`;
  await ejecutarConsulta(query, [idUsuario, idUsuarioCompartido]);
}

async function consultarCompartidos(idUsuario) {
  const query = `
      SELECT registros_compartidos.*, datos_usuario.*
      FROM registros_compartidos
      INNER JOIN datos_usuario
      ON registros_compartidos.usuarioCompartido_id = datos_usuario.usuario_id
      WHERE registros_compartidos.usuario_id = ?`;
  return ejecutarConsulta(query, [idUsuario]);
}

async function consultarCompartidoExistente(idUsuario, idUsuarioCompartido) {
  const query = `SELECT * FROM registros_compartidos WHERE usuario_id = ? AND usuarioCompartido_id = ? OR usuario_id = ? AND usuarioCompartido_id = ?`;
  return ejecutarConsulta(query, [idUsuario, idUsuarioCompartido, idUsuarioCompartido, idUsuario]);
}

async function consultarVerificado(telefono) {
  if (telefono) {
    const telefonoLimpio = telefono.replace(/\s/g, "");
    const query = `SELECT * FROM verificados WHERE telefono = ?`;
    const verificaciones = await ejecutarConsulta(query, [telefonoLimpio]);
    return verificaciones.length > 0 ? "V" : "N";
  } else {
    return "";
  }
}

async function insertarVerificacion(idUsuario, telefono) {
  const telefonoLimpio = telefono.replace(/\s/g, "");
  const query = `INSERT INTO verificados (usuario_id, telefono) VALUES (?, ?) ON DUPLICATE KEY UPDATE telefono = VALUES(telefono);`;
  await ejecutarConsulta(query, [idUsuario, telefonoLimpio]);
}

async function eliminarVerificacion(idUsuario) {
  const query = `DELETE FROM verificados WHERE usuario_id = ?;`;
  await ejecutarConsulta(query, [idUsuario]);
}


module.exports = {
  registrarCodigo,
  registrarCompartido,
  consultarCodigo,
  consultarCodigoExistente,
  consultarCompartidos,
  consultarCompartidoExistente,
  consultarVerificado,
  insertarVerificacion,
  eliminarCodigo,
  eliminarVerificacion
};
