import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();
const controller = new AuthController();

router.post("/register", (req, res) => controller.register(req, res));
router.post("/login", (req, res) => controller.login(req, res));



router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Perfil del usuario autenticado",
    user: (req as any).user,
  });
});

export default router;
