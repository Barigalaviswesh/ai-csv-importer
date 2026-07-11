require('dotenv').config();

const config = {
  port: process.env.PORT || 3001,
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-pro'
  },
  upload: {
    maxFileSize: 50 * 1024 * 1024,
    allowedTypes: ['text/csv', 'application/vnd.ms-excel', 'application/csv']
  },
  ai: {
    batchSize: 50,
    maxRetries: 3,
    timeout: 60000
  }
};

module.exports = config;
