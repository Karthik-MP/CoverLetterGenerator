const express = require("express");
const dotenv = require("dotenv");
// const mongoose = require("mongoose");

// Import Routes
const coverLetterRoutes = require("./routes/coverLetter");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.error("MongoDB Connection Failed:", err));

app.use("/api/generate-cover-letters", coverLetterRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
