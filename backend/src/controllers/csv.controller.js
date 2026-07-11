const csvParser = require('../services/csv-parser.service');
const aiExtraction = require('../services/ai-extraction.service');
const validator = require('../services/validation.service');
const fs = require('fs');
const path = require('path');

class CSVController {
  async uploadCSV(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      console.log('Processing file:', req.file.filename);
      console.log('File size:', req.file.size, 'bytes');

      const { headers, data } = await csvParser.parseCSV(req.file.path);
      console.log('CSV parsed. Headers:', headers.length, 'Rows:', data.length);

      if (data.length === 0) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'CSV file is empty' });
      }

      console.log('Starting AI extraction...');
      const extractedRecords = await aiExtraction.extractCRMFields(data, headers);
      console.log('AI extraction complete. Records extracted:', extractedRecords.length);

      const success = [];
      const skipped = [];

      for (let i = 0; i < extractedRecords.length; i++) {
        try {
          const validated = validator.validateCRMRecord(extractedRecords[i]);
          
          if (validator.hasContactInfo(validated)) {
            if (validated.created_at && !validator.isValidDate(validated.created_at)) {
              validated.created_at = new Date().toISOString();
            }
            
            validated.reason = 'Imported successfully';
            success.push(validated);
          } else {
            skipped.push({
              originalData: data[i],
              reason: 'No email or mobile number found',
              rowIndex: i
            });
          }
        } catch (error) {
          skipped.push({
            originalData: data[i],
            reason: error.message,
            rowIndex: i
          });
        }
      }

      fs.unlinkSync(req.file.path);
      console.log('File deleted:', req.file.path);

      res.json({
        success,
        skipped,
        totalImported: success.length,
        totalSkipped: skipped.length
      });
    } catch (error) {
      console.error('Upload error:', error);
      
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}

module.exports = new CSVController();
