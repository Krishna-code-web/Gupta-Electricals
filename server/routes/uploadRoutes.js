const express = require('express');
const router = express.Router();
const { cloudinary, upload } = require('../config/cloudinary.js');
const { protect, adminOnly } = require('../middleware/authMiddleware.js');

// @POST /api/upload — Upload single image
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    res.json({
      url: req.file.path,
      public_id: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @POST /api/upload/multiple — Upload multiple images
router.post('/multiple', protect, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }
    const images = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @DELETE /api/upload — Delete image from cloudinary
router.delete('/', protect, adminOnly, async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ message: 'public_id is required' });
    }
    await cloudinary.uploader.destroy(public_id);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;