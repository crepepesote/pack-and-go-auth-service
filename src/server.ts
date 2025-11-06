// auth-service/src/server.ts
// ⚠️ CRÍTICO: Cargar dotenv PRIMERO, antes de cualquier import
import dotenv from 'dotenv';
import path from 'path';

// Cargar .env desde la raíz del proyecto
const envPath = path.resolve(__dirname, '../.env');
console.log('📂 Cargando .env desde:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Error cargando .env:', result.error);
  console.error('💡 Asegúrate de que el archivo .env existe en la raíz del proyecto');
  process.exit(1);
}

console.log('✅ Variables de entorno cargadas:', Object.keys(result.parsed || {}).length);

// Verificar variables críticas SMTP
const smtpVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
const missingSmtp = smtpVars.filter(v => !process.env[v]);

if (missingSmtp.length > 0) {
  console.error('❌ Faltan variables SMTP:', missingSmtp);
  process.exit(1);
}

// Verificar otras variables importantes
const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingVars = requiredVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.warn('⚠️  Faltan variables importantes:', missingVars);
}

console.log('📧 SMTP configurado:', process.env.SMTP_HOST);
console.log('👤 Usuario SMTP:', process.env.SMTP_USER);

// Ahora sí importar la app (después de cargar las variables)
import app from "./app";

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`🚀 Auth Service corriendo en el puerto ${PORT}`);
  console.log(`🌐 Listo para recibir peticiones en http://localhost:${PORT}`);
});