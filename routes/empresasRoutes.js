import express from "express";

const router = express.Router();

import {
  registrar,
  obtenerEmpresas,
  editarEmpresa,
} from "../controllers/empresasController.js";

import checkAuth from "../middleware/checkAuth.js";

router.post("/registrar", checkAuth, registrar);

router.get("/obtener-empresas", checkAuth, obtenerEmpresas);

router.post("/editar-empresa/:id", checkAuth, editarEmpresa);

export default router;
