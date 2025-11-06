// auth-service/src/test-email.ts
import dotenv from 'dotenv';
import path from 'path';

// Carga el .env desde la raíz del proyecto
const envPath = path.resolve(__dirname, '../.env');
console.log('📂 Buscando .env en:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Error cargando .env:', result.error);
  console.log('💡 Verifica que el archivo .env existe en:', envPath);
  process.exit(1);
}

console.log('✅ Archivo .env encontrado!');
console.log('✅ Variables cargadas:', Object.keys(result.parsed || {}).length);

// Ahora sí importar otros módulos
import { sendMail } from './config/mailer';

async function testEmail() {
  console.log('\n🧪 Probando configuración de correo...');
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_SECURE:', process.env.SMTP_SECURE);
  console.log('FROM_EMAIL:', process.env.FROM_EMAIL);
  
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ Faltan variables SMTP necesarias');
    process.exit(1);
  }
  
  try {
    console.log('\n📤 Enviando correo de prueba...');
    const result = await sendMail({
      to: process.env.SMTP_USER!, // Envía a ti mismo
      subject: 'Test - PacketAndGo',
      html: '<h1>✅ El correo funciona!</h1><p>Tu configuración SMTP está correcta.</p>',
    });
    
    console.log('✅ Correo de prueba enviado exitosamente!');
    console.log('Message ID:', result.messageId);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error enviando correo de prueba:', error);
    process.exit(1);
  }
}

testEmail();