// hash.js
const bcrypt = require('bcryptjs');

async function generarHash(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log(`Contraseña: ${password} → Hash: ${hash}`);
}

generarHash('ad1235');  // contrase;a para hash

