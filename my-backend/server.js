const cors = require('cors');
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Set up Express
const app = express();
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all origins

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up file upload handling
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
});

// Rate limiting for upload endpoint
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 uploads per windowMs
});
app.use('/upload', uploadLimiter);

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Delete the temporary file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temporary file:', err);
    });

    res.json({ url: result.secure_url }); // Return the uploaded image URL
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    if (error.message === 'Only image files are allowed!') {
      return res.status(400).json({ error: 'Only image files are allowed!' });
    }
    if (error.message === 'File too large') {
      return res.status(400).json({ error: 'File size must be less than 5MB' });
    }
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Create a listing endpoint
app.post("/listings", async (req, res) => {
  try {
    const listingData = req.body;

    // Log the received data from the frontend (just for debugging)
    console.log("Received data:", listingData);

    // Respond to the client with a success message
    res.status(201).json({ message: "Listing created successfully!" });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});