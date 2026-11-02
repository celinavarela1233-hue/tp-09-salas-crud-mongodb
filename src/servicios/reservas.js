const Reserva = require("../modelos/reservas");
const mongoose = require("mongoose");

function validarId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Identificador inválido");
    error.codigo = "ID_INVALIDO";
    throw error;
  }
}

async function listar() {
  const documentos = await Reserva.find({}).lean();
  return documentos.map(representarReserva);
}

async function obtenerPorId(id) {
  validarId(id);
  const documento = await Reserva.findById(id).lean();
  return documento ? representarReserva(documento) : null;
}

async function crear(datos) {
  const documento = await Reserva.create({
    estudiante: datos.estudiante,
    email: datos.email,
    sala: datos.sala,
    fecha: datos.fecha,
    turno: datos.turno,
    personas: datos.personas,
  });
  return representarReserva(documento);
}

async function reemplazar(id, datos) {
  validarId(id);
  const reemplazo = {
    estudiante: datos.estudiante,
    email: datos.email,
    sala: datos.sala,
    fecha: datos.fecha,
    turno: datos.turno,
    personas: datos.personas,
    estado: datos.estado,
  };
  const documento = await Reserva.findOneAndReplace({ _id: id }, reemplazo, {
    runValidators: true,
    returnDocument: "after",
    upsert: false,
  });
  return documento ? representarReserva(documento) : null;
}

async function actualizar(id, datos) {
  validarId(id);
  const cambios = {};
  for (const campo of ["personas", "estado"]) {
    if (Object.hasOwn(datos, campo)) {
      cambios[campo] = datos[campo];
    }
  }
  if (Object.keys(cambios).length === 0) {
    const error = new Error("Actualización vacía");
    error.codigo = "ENTRADA_INVALIDA";
    throw error;
  }
  const documento = await Reserva.findOneAndUpdate(
    { _id: id },
    { $set: cambios },
    { runValidators: true, returnDocument: "after", upsert: false },
  );
  return documento ? representarReserva(documento) : null;
}

async function eliminar(id) {
  validarId(id);
  const resultado = await Reserva.deleteOne({ _id: id });
  return resultado.deletedCount === 1;
}

function representarReserva(documento) {
  return {
    id: documento._id.toString(),
    estudiante: documento.estudiante,
    email: documento.email,
    sala: documento.sala,
    fecha: documento.fecha,
    turno: documento.turno,
    personas: documento.personas,
    estado: documento.estado,
  };
}

module.exports = {
  listar,
  obtenerPorId,
  crear,
  reemplazar,
  actualizar,
  eliminar,
};
