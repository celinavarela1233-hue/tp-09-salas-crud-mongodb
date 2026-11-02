function validarReemplazoReserva(req, res, next) {
  const datos = req.body;
  const permitidos = [
    "estudiante",
    "email",
    "sala",
    "fecha",
    "turno",
    "personas",
    "estado",
  ];
  for (const campo of Object.keys(datos)) {
    if (!permitidos.includes(campo)) {
      return res
        .status(400)
        .json({ error: `El campo ${campo} no se puede modificar.` });
    }
  }
  if (datos.estado && !["pendiente", "confirmada"].includes(datos.estado)) {
    return res
      .status(400)
      .json({ error: "El estado debe ser pendiente o confirmada." });
  }
  req.cambiosValidos = {
    ...req.productoValidado,
    estado: datos.estado,
  };
  next();
}

function validarActualizacionReserva(req, res, next) {
  const datos = req.body;
  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return res.status(400).json({ error: "Enviá un objeto JSON." });
  }
  for (const campo of Object.keys(datos)) {
    if (campo !== "personas" && campo !== "estado") {
      return res
        .status(400)
        .json({ error: "Solo se puede cambiar personas o estado." });
    }
  }
  if (datos.personas === undefined && datos.estado === undefined) {
    return res.status(400).json({ error: "Enviá personas o estado." });
  }
  const cambios = {};
  if (datos.personas !== undefined) {
    if (
      typeof datos.personas !== "number" ||
      !Number.isFinite(datos.personas) ||
      datos.personas < 1 ||
      datos.personas > 6
    ) {
      return res
        .status(400)
        .json({ error: "Personas debe ser un número entero entre 1 y 6." });
    }
    cambios.personas = datos.personas;
  }
  if (datos.estado !== undefined) {
    if (!["pendiente", "confirmada"].includes(datos.estado)) {
      return res
        .status(400)
        .json({ error: "El estado debe ser pendiente o confirmada." });
    }
    cambios.estado = datos.estado;
  }
  req.cambiosValidos = cambios;
  next();
}

module.exports = {
  validarReemplazoReserva,
  validarActualizacionReserva,
};
