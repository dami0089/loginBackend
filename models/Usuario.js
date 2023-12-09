import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const usuarioSchema = mongoose.Schema(
  {
    empresa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empresas",
    },
    nombreUsuario: {
      type: String,
      trim: true,
      unique: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    rol: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    admin: {
      type: Boolean,
      trim: true,
    },
    observacion: {
      type: String,
      trim: true,
    },
    token: {
      type: String,
    },
    autentication: {
      type: String,
    },

    confirmado: {
      type: Boolean,
      default: false,
    },
    nombreEmpresa: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
  return await bcryptjs.compare(passwordFormulario, this.password);
};

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
