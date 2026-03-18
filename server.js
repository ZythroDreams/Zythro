const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// fix path
const uploadPath = path.join(__dirname, "uploads");

// create uploads folder if missing
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// storage config
const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

// upload route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file");

  const fileUrl = `${req.protocol}://${req.get("host")}/files/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// serve uploaded files
app.use("/files", express.static(uploadPath));

// fallback (THIS FIXES "Not Found")
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on " + PORT));
