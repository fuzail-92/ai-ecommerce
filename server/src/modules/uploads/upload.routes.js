const express = require('express');
const router = express.Router();
const upload = require('../../middleware/upload.middleware');
const authMiddleware = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

// Upload single image (admin only)
router.post(
  '/',
  authMiddleware.protect,
  authorize('admin'),
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(201).json({ success: true, data: { imageUrl } });
  }
);

module.exports = router;
