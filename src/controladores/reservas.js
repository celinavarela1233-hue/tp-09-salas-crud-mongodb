function crearControladorReservas(servicioReservas) {

  async function listarHtml(req, res, next) {
    try {
      const reservas = await servicioReservas.listar();
      res.render("reservas/lista", { reservas, titulo: "Lista de Reservas" });
    } catch (error) {
      next(error);
    }
  }

  async function verDetalleHtml(req, res, next) {
    try {
      const reserva = await servicioReservas.obtenerPorId(req.params.id);
      if (!reserva) {
        return res.status(404).render("no-encontrado", { titulo: "Reserva No Encontrada" });
      }
      res.render("reservas/detalle", { reserva, titulo: "Detalle de Reserva" });
    } catch (error) {
      next(error);
    }
  }

  function formularioNueva(req, res) {
    res.render("reservas/nueva", {
      titulo: "Nueva Reserva",
      error: null,
      valores: {},
    });
  }

  async function crearHtml(req, res, next) {
    try {
      await servicioReservas.crear(req.body);
      res.redirect("/reservas");
    } catch (error) {
      if (error.name === "ValidationError") {
        const mensajes = Object.values(error.errors).map((e) => e.message);
        return res.status(400).render("reservas/nueva", {
          titulo: "Nueva Reserva",
          error: mensajes.join(". "),
          valores: req.body,
        });
      }
      next(error);
    }
  }


  async function listarApi(req, res, next) {
    try {
      const reservas = await servicioReservas.listar();
      res.json(reservas);
    } catch (error) {
      next(error);
    }
  }

  async function obtenerApi(req, res, next) {
    try {
      const reserva = await servicioReservas.obtenerPorId(req.params.id);
      if (!reserva) {
        return res.status(404).json({ error: "Reserva no encontrada" });
      }
      res.json(reserva);
    } catch (error) {
      next(error);
    }
  }

  async function crearApi(req, res, next) {
    try {
      const reserva = await servicioReservas.crear(req.body);
      res.status(201).json(reserva);
    } catch (error) {
      next(error);
    }
  }

  
  async function reemplazarApi(req, res, next) {
    try {
      const reserva = await servicioReservas.reemplazar(req.params.id, req.body);
      if (!reserva) {
        return res.status(404).json({ error: "Reserva no encontrada" });
      }
      res.json(reserva);
    } catch (error) {
      next(error);
    }
  }

  async function actualizarApi(req, res, next) {
    try {
      const reserva = await servicioReservas.actualizar(req.params.id, req.body);
      if (!reserva) {
        return res.status(404).json({ error: "Reserva no encontrada" });
      }
      res.json(reserva);
    } catch (error) {
      next(error);
    }
  }

  async function eliminarApi(req, res, next) {
    try {
      const reserva = await servicioReservas.eliminar(req.params.id);
      if (!reserva) {
        return res.status(404).json({ error: "Reserva no encontrada" });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  return {
    listarHtml,
    verDetalleHtml,
    formularioNueva,
    crearHtml,
    listarApi,
    obtenerApi,
    crearApi,
    reemplazarApi,
    actualizarApi,
    eliminarApi,
  };
}

module.exports = crearControladorReservas;