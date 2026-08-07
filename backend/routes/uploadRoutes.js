const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/uploadMiddleware');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, upload.single('image'), uploadController.uploadImage);

module.exports = router;
