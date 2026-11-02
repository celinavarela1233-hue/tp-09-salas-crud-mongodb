const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

const servicioReservas = require("./servicios/reservas");
const crearControladorReservas = require("./controladores/reservas");
const crearRouterReservasHtml = require("./rutas/reservas");
const crearRouterReservasApi = require("./rutas/reservas-api");
const { crearManejadorErrores } = require("./middleware/errores");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views")); 
app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const controlador = crearControladorReservas(servicioReservas);


app.use("/api/reservas", crearRouterReservasApi(controlador));
app.use("/", crearRouterReservasHtml(controlador));

app.use(crearManejadorErrores("reservas/nueva", "Nueva Reserva"));

module.exports = app;