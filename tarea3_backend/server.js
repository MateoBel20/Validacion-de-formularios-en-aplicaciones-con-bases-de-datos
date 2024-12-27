const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Habilitar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

app.use(bodyParser.json());

// Conexión a MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/usuarios")
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.log("Error al conectar a MongoDB", error));

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
});

const User = mongoose.model("User", UserSchema);

// Ruta para registrar usuario
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  // Validaciones en el backend
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios." });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "La contraseña debe tener al menos 6 caracteres." });
  }

  try {
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: "Usuario registrado exitosamente." });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está registrado." });
    }
    res
      .status(500)
      .json({ message: "Error en el servidor. Inténtalo más tarde." });
  }
});

// Inicia el servidor
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
