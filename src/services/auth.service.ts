// auth-service/src/services/auth.service.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "./email.service"; // archivo que implementarás aparte

const prisma = new PrismaClient();

export class AuthService {
  async register(name: string, email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("El usuario ya existe");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Enviar email de bienvenida (no bloqueante: fallo en el correo no detiene el registro)
    try {
      await sendWelcomeEmail(user.email, user.name || undefined);
      console.log("✅ Correo enviado exitosamente a:", user.email);
    } catch (err) {
      console.error(
        "No se pudo enviar el email de bienvenida para userId=",
        user.id,
        err
      );
      // aquí podrías reportar a Sentry/Logger si tienes
    }

    return this.generateToken(user);
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) throw new Error("Credenciales inválidas");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Credenciales inválidas");

    return this.generateToken(user);
  }

  generateToken(user: any) {
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // eliminar password del objeto que se devuelve
    const { password, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
  }
}
