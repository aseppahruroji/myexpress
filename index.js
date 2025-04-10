const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const jadwalRoutes = require("./src/routes/jadwal");
const dokterRoutes = require("./src/routes/dokter");

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use("/jadwal", jadwalRoutes);
app.use("/dokter", dokterRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
