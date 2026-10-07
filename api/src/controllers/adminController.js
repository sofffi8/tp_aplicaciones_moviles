export const obtenerMetricas = async (req, res) => {
  try {
    return res.json({
      estado: true,
      metricas: {
        ventasTotales: 154000,
        pedidosPendientes: 12,
        usuariosRegistrados: 340,
        sistemaStatus: 'Operativo'
      }
    });
  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: 'Error al obtener métricas', error: error.message });
  }
};