const bcrypt = require("bcrypt");
const saltRounds = 10;




async function generateSalt() {
  const salt = await bcrypt.genSalt(saltRounds);
  return salt;
}

async function hashPassword(password) {
  // Generate a salt and hash the password with it
  const salt = await generateSalt();
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

module.exports = {
  generateSalt,
  hashPassword
};
