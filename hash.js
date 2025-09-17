// hash.js
const bcrypt = require('bcryptjs');

async function generarHash(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log(`Contraseña: ${password} → Hash: ${hash}`);
}

generarHash('');  // 🔹 cambia '1234' por la contraseña que quieras
generarHash(''); // puedes generar varios
