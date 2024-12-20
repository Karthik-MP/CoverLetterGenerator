const express = require("express");
const dotenv = require("dotenv");
// const mongoose = require("mongoose");

// Import Routes
const coverLetterRoutes = require("./routes/coverLetter");
const auth = require("./routes/user/authRoutes");
const { sequelize } = require("./config/dbconfig");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// sequelize.sync({ force: true })  // `force: false` avoids dropping tables
//   .then(() => {
//     console.log("Tables are synchronized!");
//   })
//   .catch((err) => {
//     console.error("Error syncing tables:", err);
//   });

app.use("/api/auth", auth);
app.use("/api/generate-cover-letters", coverLetterRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
