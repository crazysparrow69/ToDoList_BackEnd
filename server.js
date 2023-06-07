// Requires
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

// Global variables
const app = express();
const PORT = 5000;

// Built-in middleware
app.use(express.json());
app.use(cors());

// Routing
app.use("/user", require("./routes/userRoute"));
app.use("/auth", require("./routes/authRoute"));
app.use("/task", require("./routes/taskRoute"));
app.use("/category", require("./routes/categoryRoute"));
app.use("/password", require("./routes/passwordRoute"));
app.use("/upload", require("./routes/imageRoute"));


// Connecting
mongoose.set("strictQuery", false);
mongoose
  .connect(
    process.env.DATABASE_URI
  )
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.log("DB error", err));
