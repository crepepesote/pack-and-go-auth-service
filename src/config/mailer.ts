// auth-service/src/config/mailer.ts
import nodemailer from 'nodemailer';

// Verificar variables de entorno al cargar
if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error('❌ FALTAN VARIABLES DE ENTORNO SMTP:');
  console.error('SMTP_HOST:', process.env.SMTP_HOST);
  console.error('SMTP_USER:', process.env.SMTP_USER);
  console.error('SMTP_PASS:', process.env.SMTP_PASS ? '***' : 'FALTA');
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: (process.env.SMTP_SECURE === 'true'), // true si puerto 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: true, // 👈 Activa logs detallados
  logger: true, // 👈 Muestra logs en consola
});

// Verificar conexión al iniciar
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error al conectar con el servidor SMTP:', error);
  } else {
    console.log('✅ Servidor SMTP listo para enviar correos');
  }
});

/**
 * Envía un email con las opciones proporcionadas.
 */
export async function sendMail(options: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}) {
  console.log('📧 Intentando enviar correo a:', options.to);
  
  const mailOptions = {
    from: options.from || process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    throw error;
  }
}