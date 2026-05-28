const multer = require('multer');

// ✅ store in memory so buffer is available in controller
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
}

const upload = multer({ storage, fileFilter });

module.exports = { upload };