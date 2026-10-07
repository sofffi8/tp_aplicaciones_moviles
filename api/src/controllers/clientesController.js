export const obtenerPerfil = async (req, res) => {
  try {
    // guarda las columnas del modelo cliente
    const clienteData = req.cliente.toJSON();
    // borra el hash de la contraseña
    delete clienteData.password;
    // borra el refresh token
    delete clienteData.refreshToken;
    // devuelve el objeto del cliente
    return res.json({ estado: true, cliente: clienteData });
  } catch (error) {
    return res
      .status(500)
      .json({
        estado: false,
        mensaje: "Error al obtener perfil",
        error: error.message,
      });
  }
};
