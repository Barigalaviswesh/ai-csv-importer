const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.message === 'Only CSV files are allowed') {
    return res.status(400).json({ error: err.message });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File size exceeds 50MB limit' });
  }

  if (err.message.includes('OpenAI API')) {
    return res.status(500).json({ error: 'AI processing failed. Please try again.' });
  }

  res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorHandler;
