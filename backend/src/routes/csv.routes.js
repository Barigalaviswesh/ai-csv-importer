const express = require('express');
const router = express.Router();
const csvController = require('../controllers/csv.controller');
const upload = require('../middleware/upload.middleware');

// Upload CSV endpoint
router.post('/upload', upload.single('file'), csvController.uploadCSV);

module.exports = router;
