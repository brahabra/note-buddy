const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // Store file in memory

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Set max file size to 2MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
});

module.exports = { upload };