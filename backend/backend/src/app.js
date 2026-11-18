const express = require("express");
const usuariosRoutes = require("./routes/usuarios");
const productosRoutes = require("./routes/productos");
const hitosRoutes = require("./routes/hitos");
const hitosChacoRoutes = require("./routes/hitos-chaco");
const chatbotRoutes = require("./routes/chatbot");
const inicioRoutes = require("./routes/inicio");
const serviciosRoutes = require("./routes/servicios");
const especialidadesRoutes = require("./routes/especialidades");
const nosotrosRoutes = require("./routes/nosotros");
const galeriaFotosRoutes = require("./routes/galeria_fotos");
const preciosRoutes = require("./routes/precios");
const contactosRoutes = require("./routes/contactos");
const errorHandler = require("./middlewares/error-handler");
const requireJsonObject = require("./middlewares/require-json-object");
const cors = require("./middlewares/cors");

const app = express();

app.disable("x-powered-by");
app.use(cors);
app.use(express.json({ limit: "1mb" }));
app.use(requireJsonObject);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/hitos", hitosRoutes);
app.use("/api/hitos-chaco", hitosChacoRoutes);

app.use("/api/inicio", inicioRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/especialidades", especialidadesRoutes);
app.use("/api/nosotros", nosotrosRoutes);
app.use("/api/galeria-fotos", galeriaFotosRoutes);
app.use("/api/precios", preciosRoutes);
app.use("/api/contactos", contactosRoutes);

app.use("/api/chatbot", chatbotRoutes);
app.use("/ollama-prompt", chatbotRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});
app.use(errorHandler);

module.exports = app;
