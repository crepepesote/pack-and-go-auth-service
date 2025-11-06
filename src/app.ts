// auth-service/src/app.ts
// Las variables ya se cargan en server.ts, pero por seguridad las cargamos aquí también
import dotenv from 'dotenv';
dotenv.config(); // Si ya están cargadas, no hace nada

// Ahora sí, los demás imports
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport";
import authRoutes from "./routes/auth.routes";
import oauthRoutes from "./routes/oauth.routes";

const app = express();

// Middlewares base
app.use(cors());
app.use(express.json());

// Soporte de sesión (requerido por Passport para OAuth 2.0)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecreto",
    resave: false,
    saveUninitialized: false,
  })
);

// Inicializamos Passport y sesión
app.use(passport.initialize());
app.use(passport.session());

// Rutas de autenticación local y social
app.use("/auth", authRoutes);
app.use("/auth", oauthRoutes);

export default app;