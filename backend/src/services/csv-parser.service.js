const Papa = require('papaparse');
const fs = require('fs');

class CSVParserService {
  async parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(filePath, 'utf8');
      const records = [];
      let headers = [];

      Papa.parse(fileStream, {
        header: true,
        skipEmptyLines: true,
        step: (row, parser) => {
          if (headers.length === 0) {
            headers = row.meta.fields || [];
          }
          records.push(row.data);
        },
        complete: () => {
          resolve({
            headers,
            data: records,
            totalRows: records.length
          });
        },
        error: (error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`));
        }
      });
    });
  }

  async parseCSVInBatches(filePath, batchSize = 100, onBatch) {
    return new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(filePath, 'utf8');
      const records = [];
      let headers = [];
      let batchCount = 0;

      Papa.parse(fileStream, {
        header: true,
        skipEmptyLines: true,
        step: (row, parser) => {
          if (headers.length === 0) {
            headers = row.meta.fields || [];
          }
          records.push(row.data);

          if (records.length >= batchSize) {
            batchCount++;
            if (onBatch) {
              onBatch([...records], batchCount);
            }
            records.length = 0;
          }
        },
        complete: () => {
          if (records.length > 0 && onBatch) {
            batchCount++;
            onBatch(records, batchCount);
          }
          resolve({
            headers,
            totalBatches: batchCount
          });
        },
        error: (error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`));
        }
      });
    });
  }
}

module.exports = new CSVParserService();
