import mongoose from "mongoose";

const entidadesSchema = mongoose.Schema(
  {
    cuit: {
      type: String,
      trim: true,
      unique: true,
    },
    prompt: {
      type: String,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    direccion: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Entidades = mongoose.model("Entidades", entidadesSchema);

export default Entidades;
