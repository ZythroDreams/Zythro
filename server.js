const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

// storage config
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  const fileUrl = `${req.protocol}://${req.get("host")}/files/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// serve files
app.use("/files", express.static("uploads"));

// serve frontend
app.use(express.static("public"));

app.listen(3000, () => console.log("Server running"));
