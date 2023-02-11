// Requires
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");

// Global variables
const app = express();
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
const PORT = 5000;

// Built-in middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Routing
app.use("/user", require("./routes/userRoute"));
app.use("/auth", require("./routes/authRoute"));
app.use("/task", require("./routes/taskRoute"));
app.use("/category", require("./routes/categoryRoute"));
app.use("/password", require("./routes/passwordRoute"));
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// Connecting
mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://crazysparrow:564793@cluster0.8aeyxsx.mongodb.net/toDoList_FullStack?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.log("DB error", err));
