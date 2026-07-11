const csvParserService = require('../csv-parser.service');
const fs = require('fs');
const path = require('path');

describe('CSVParserService', () => {
  const testFilePath = path.join(__dirname, 'test.csv');

  beforeAll(() => {
    const testCSV = `name,email,phone
John Doe,john@example.com,+919876543210
Jane Smith,jane@example.com,+919876543211`;
    fs.writeFileSync(testFilePath, testCSV);
  });

  afterAll(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  test('should parse CSV file correctly', async () => {
    const result = await csvParserService.parseCSV(testFilePath);
    
    expect(result).toHaveProperty('headers');
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('totalRows');
    
    expect(result.headers).toEqual(['name', 'email', 'phone']);
    expect(result.data).toHaveLength(2);
    expect(result.data[0]).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+919876543210'
    });
    expect(result.totalRows).toBe(2);
  });

  test('should handle empty CSV file', async () => {
    const emptyFilePath = path.join(__dirname, 'empty.csv');
    fs.writeFileSync(emptyFilePath, 'name,email\n');
    
    const result = await csvParserService.parseCSV(emptyFilePath);
    
    expect(result.data).toHaveLength(0);
    expect(result.totalRows).toBe(0);
    
    fs.unlinkSync(emptyFilePath);
  });

  test('should handle CSV with special characters', async () => {
    const specialFilePath = path.join(__dirname, 'special.csv');
    const specialCSV = `name,email,notes
"O'Brien",obrien@example.com,"Note with, comma"`;
    fs.writeFileSync(specialFilePath, specialCSV);
    
    const result = await csvParserService.parseCSV(specialFilePath);
    
    expect(result.data[0].name).toBe("O'Brien");
    expect(result.data[0].notes).toBe('Note with, comma');
    
    fs.unlinkSync(specialFilePath);
  });
});
