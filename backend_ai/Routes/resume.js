const express = require('express');
const router = express.Router();
const resumeController = require('../Controllers/resume');
const {upload} = require('../utils/multer');


router.post('/addresume', upload.single("resume"), resumeController.uploadResume);
router.get('/getresumes/:userId', resumeController.getallResumeforUser);
router.get('/getAdmin', resumeController.getallResumeforAdmin);

module.exports = router;