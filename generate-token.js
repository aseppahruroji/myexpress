// generate-token.js
const jwt = require("jsonwebtoken");

require("dotenv").config();

const token = jwt.sign({ user_id: 1, name: "Admin" }, process.env.JWT_SECRET, {
  expiresIn: "1d",
});

console.log("Generated token:\n");
console.log(token);
