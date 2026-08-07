exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Image upload failed. No file provided.' });
  }
  return res.status(200).json({
    message: 'Image uploaded successfully.',
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
};
