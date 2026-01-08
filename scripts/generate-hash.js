// Script untuk generate password hash
const bcrypt = require('bcryptjs');

console.log('Generating password hashes...\n');

const adminPassword = 'admin123';
const siswaPassword = 'siswa123';

const adminHash = bcrypt.hashSync(adminPassword, 10);
const siswaHash = bcrypt.hashSync(siswaPassword, 10);

console.log('Admin password hash (admin123):');
console.log(adminHash);
console.log('\nSiswa password hash (siswa123):');
console.log(siswaHash);

console.log('\n\nSQL Update Statements:');
console.log('-----------------------------------');
console.log(`UPDATE users SET password = '${adminHash}' WHERE email = 'admin@sekolah.com';`);
console.log(`UPDATE users SET password = '${siswaHash}' WHERE email = 'siswa@sekolah.com';`);
