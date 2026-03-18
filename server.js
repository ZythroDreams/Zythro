const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// ✅ make uploads folder if it doesn't exist (FIXES RENDER ISSUE)
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// storage config
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// upload setup
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// ✅ serve frontend
app.use(express.static("public"));

// ✅ homepage route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// ✅ upload route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/files/${req.file.filename}`;

  res.json({ url: fileUrl });
});

// ✅ serve uploaded files
app.use("/files", express.static("uploads"));

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
