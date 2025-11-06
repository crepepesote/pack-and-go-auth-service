// auth-service/src/services/email.service.ts
import { sendMail } from '../config/mailer';

export async function sendWelcomeEmail(to: string, name?: string) {
  const frontendUrl = process.env.FRONTEND_URL ?? 'https://packetandgo.example.com';
  const displayName = name || 'Usuario';

  const subject = 'Se ha registrado exitosamente en PacketAndGo';
  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; line-height:1.4;">
      <h2>Bienvenido a PacketAndGo, ${displayName} 🎉</h2>
      <p>Tu cuenta se ha creado correctamente. Gracias por unirte a PacketAndGo.</p>

      <p>Visita nuestro sitio para empezar: <a href="${frontendUrl}">${frontendUrl}</a></p>

      <hr/>
      <p style="font-size:0.9em;color:#666;">
        Si no te registraste, ignora este correo o contacta soporte.
      </p>
    </div>
  `;

  try {
    const info = await sendMail({ to, subject, html });
    // opcional: devolver info para logging si lo quieres
    return info;
  } catch (err) {
    // No detengas el flujo de creación de usuario por fallos en email.
    console.error('Error enviando welcome email:', err);
    throw err; // o simplemente manejar aquí según prefieras
  }
}
