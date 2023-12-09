import express from "express";

const router = express.Router();

import {
  registrar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
  crearPassword,
  comprobarUsuario,
  editarUsuario,
  eliminarUsuario,
  obtenerUsuarios,
  validarAutentication,
} from "../controllers/usuarioController.js";

import checkAuth from "../middleware/checkAuth.js";

//Autenticacion registro y confirmacino de usuarios
// router.post("/", registrar); // crea un nuevo usuario
router.post("/login", autenticar);
// router.get("/confirmar/:token", confirmar);
router.route("/crear-password/:token").get(comprobarToken).post(crearPassword);
router.post("/olvide-password", olvidePassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);
router.post("/comprobar", checkAuth, comprobarUsuario);
router.put("/editar-usuario/:id", checkAuth, editarUsuario);
router.get("/perfil", checkAuth, perfil);
router.delete("/eliminar-usuario/:id", checkAuth, eliminarUsuario);
router.get("/obtener-usuarios", checkAuth, obtenerUsuarios);

router.post("/autentication/:id", validarAutentication);

router.post("/registrar/", checkAuth, registrar); // crea un nuevo usuario

export default router;
