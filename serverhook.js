const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Audiohook endpoint
app.post('/audiohook', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No audio file uploaded.');
  }
  res.status(200).send(`Audio file received and saved as ${req.file.filename}`);
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Audiohook server is running.');
});

// Start server
app.listen(port, () => {
  console.log(`Audiohook server listening at http://localhost:${port}`);
});
