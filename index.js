import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "http"; // <-- Importa esto

import conectarDB from "./config/db.js";
import router from "./routes/usuarioRoutes.js";
import routesEmpresa from "./routes/empresasRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

app.use(cors());

// Routing
app.use("/api/usuarios", router);
app.use("/api/empresas", routesEmpresa);

const PORT = process.env.PORT || 4000;

// Crea una instancia del servidor HTTP y asóciala con tu app Express
const httpServer = new Server(app);

// Usa httpServer en lugar de app para iniciar el servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
