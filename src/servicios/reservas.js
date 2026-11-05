const Reserva = require("../modelos/reservas");

async function listar(query = {}) {
  const reservas = await Reserva.find(query);
  return reservas;
}

async function obtenerPorId(id) {
  const reserva = await Reserva.findById(id);
  return reserva;
}

async function crear(datos) {
  const nuevaReserva = new Reserva(datos);
  return await nuevaReserva.save();
}

async function eliminar(id) {
  return await Reserva.findByIdAndDelete(id);
}

async function reemplazar(id, datos) {
  return await Reserva.findByIdAndUpdate(id, datos, {
    new: true,
    runValidators: true,
    upsert: false,
  });
}

async function actualizar(id, datos) {
  return await Reserva.findByIdAndUpdate(id, { $set: datos }, {
    new: true,
    runValidators: true,
    upsert: false,
  });
}

module.exports = {
  listar,
  obtenerPorId,
  crear,
  eliminar,
  reemplazar,
  actualizar,
  obtenerTodas: listar,
};