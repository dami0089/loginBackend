import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";
import Empresas from "../models/Empresas.js";

const obtenerUsuario = async (req, res) => {
  const { id } = req.params;
  console.log("entro a obtener usuario");
  const usuario = await Usuario.findById(id);
  console.log("Consulte el usuario, es este: " + usuario);
  if (usuario) {
    const error = new Error("No existe el usuario");
    return res.status(403).json({ msg: error.message });
  }
  res.json(usuario);
};

const comprobarUsuario = async (req, res) => {
  const { email } = req.body;

  const existeUsuario = await Usuario.findOne({ email });

  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  res.json({ msg: "ok" });
};

const editarUsuario = async (req, res) => {
  const { id } = req.params;

  const usuario = await Usuario.findById(id);

  if (!usuario) {
    const error = new Error("No encontrado");
    return res.status(404).json({ msg: error.message });
  }
  usuario.nombreUsuario = req.body.nombreUsuario || usuario.nombreUsuario;
  usuario.nombre = req.body.nombre || usuario.nombre;
  usuario.apellido = req.body.apellido || usuario.apellido;
  usuario.email = req.body.email || usuario.email;

  try {
    const usuarioAlmacenado = await usuario.save();
    res.json(usuarioAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const registrar = async (req, res) => {
  let { email } = req.body;

  email = email.toLowerCase();

  const existeUsuario = await Usuario.findOne({ email });
  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();

    const usuarioAlmacenado = await usuario.save();

    // Enviamos el email de confirmacion
    emailRegistro({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });

    res.json({ msg: "Usuario Creado Correctamente." });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;
  console.log("Autentico");
  const emailRegex = new RegExp(`^${email}$`, "i");
  let usuario = await Usuario.findOne({ email: emailRegex });

  // Si no se encuentra por email, intentar por nombre de usuario
  if (!usuario) {
    const usernameRegex = new RegExp(`^${email}$`, "i");
    usuario = await Usuario.findOne({ nombreUsuario: usernameRegex });
  }

  // Comprobar si el usuario existe
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  console.log(usuario);

  // Comprobar si el usuario está confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  const idAutentication = generarId();
  console.log(idAutentication);
  usuario.autentication = idAutentication;

  // Comprobar su password
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      nombreUsuario: usuario.nombreUsuario,
      rol: usuario.rol,
      email: usuario.email,
      token: generarJWT(usuario._id),
      autentication: idAutentication,
    });
    const user = await usuario.save();
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  const usuarioConfirmar = await Usuario.findOne({ token });
  if (!usuarioConfirmar) {
    const error = new Error("Token no valido");
    return res.status(403).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = "";
    await usuarioConfirmar.save();
    res.json({ msg: "Usuario confirmado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ msg: error.message });
    }

    await usuario.remove();
    res.json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar el usuario" });
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuario.token = generarId();
    await usuario.save();

    //Enviar Email de recupero de contraseña
    emailOlvidePassword({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });

    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Usuario.findOne({ token });

  if (tokenValido) {
    res.json({ msg: "Token valido y el usuario existe" });
  } else {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });

  if (usuario) {
    usuario.password = password;
    usuario.token = "";
    try {
      await usuario.save();
      res.json({ msg: "Password modificado correctamente" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }
};

const crearPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  let { nombreUsuario } = req.body;

  const usuario = await Usuario.findOne({ token });

  nombreUsuario = nombreUsuario.toLowerCase();

  if (usuario) {
    usuario.password = password;
    usuario.token = "";
    usuario.confirmado = true;
    usuario.nombreUsuario = nombreUsuario;

    try {
      await usuario.save();
      res.json({ msg: "Password guardado correctamente" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }
};

const perfil = async (req, res) => {
  const { usuario } = req;

  res.json(usuario);
};

const obtenerUsuarios = async (req, res) => {
  const usuarios = await Usuario.find();

  try {
    res.json(usuarios);
  } catch (error) {
    req.json("Error al obtener usuarios");
  }
};

const validarAutentication = async (req, res) => {
  const { id } = req.params;

  const usuario = await Usuario.findOne({ autentication: id });

  // Comprobar si el usuario está confirmado
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(403).json({ msg: error.message });
  }

  if (usuario) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      nombreUsuario: usuario.nombreUsuario,
      rol: usuario.rol,
      email: usuario.email,
    });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

export {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
  crearPassword,
  comprobarUsuario,
  obtenerUsuario,
  editarUsuario,
  eliminarUsuario,
  obtenerUsuarios,
  validarAutentication,
};
