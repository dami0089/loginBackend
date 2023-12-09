import Empresas from "../models/Empresas.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const registrar = async (req, res) => {
  //Evita registros duplicados
  const { cuit } = req.body;

  const existeEmpresa = await Empresas.findOne({ cuit });
  if (existeEmpresa) {
    const error = new Error("La empresa ya esta registrada");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const empresa = new Empresas(req.body);

    const empresaAlmacenada = await empresa.save();

    res.json({ msg: "Empresa Creada Correctamente." });
  } catch (error) {
    console.log(error);
  }
};

const obtenerEmpresas = async (req, res) => {
  const empresas = await Empresas.find();

  try {
    res.json(empresas);
  } catch (error) {
    req.json("Error al obtener empresas");
  }
};

const editarEmpresa = async (req, res) => {
  const { id } = req.params;

  const empresa = await Empresas.findById(id);

  empresa.nombre = req.body.nombre || empresa.nombre;
  empresa.cuit = req.body.cuit || empresa.cuit;
  empresa.direccion = req.body.direccion || empresa.direccion;

  try {
    const empresaEditada = empresa.save();
    res.json(empresaEditada);
  } catch (error) {
    res.json("Error al editar");
  }
};

export { registrar, obtenerEmpresas, editarEmpresa };
