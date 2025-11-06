// routes/auth.routes.ts (o donde tengas tus rutas)
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";
const BACKEND_ORIGIN = process.env.BACKEND_URL || "http://localhost:4000";

// Inicia el flujo (ya lo tienes)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback que genera token y devuelve HTML que postMessage al opener
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err: any, user: any) => {
    if (err || !user) {
      return res.send(`
        <!DOCTYPE html>
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ ok: false, error: '${err?.message || "Auth failed"}' }, '*');
              }
              window.close();
            </script>
          </body>
        </html>
      `);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET!, 
      { expiresIn: "7d" }
    );

    const userData = { id: user.id, email: user.email, name: user.name };

    return res.send(`
      <!DOCTYPE html>
      <html>
        <body>
          <p>Autenticación exitosa, cerrando...</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                ok: true,
                token: "${token}",
                user: ${JSON.stringify(userData)}
              }, '*');
            }
            window.close();
          </script>
        </body>
      </html>
    `);
  })(req, res, next);
});
export default router;
