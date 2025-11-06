// auth-service/src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      
      // El servicio ya se encarga de enviar el correo
      const result = await authService.register(name, email, password);
      
      res.json(result);
    } catch (error: any) {
      console.error("❌ Error en register:", error);
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}