const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

class AIExtractionService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: config.gemini.model,
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json'
      }
    });
    this.batchSize = config.ai.batchSize;
    this.maxRetries = config.ai.maxRetries;
  }

  async extractCRMFields(records, headers) {
    const batches = this.createBatches(records, this.batchSize);
    const results = [];

    for (let i = 0; i < batches.length; i++) {
      console.log(`Processing batch ${i + 1} of ${batches.length}`);
      const extracted = await this.processBatch(batches[i], headers);
      results.push(...extracted);
    }

    return results;
  }

  async processBatch(batch, headers) {
    let retries = 0;
    
    while (retries < this.maxRetries) {
      try {
        return await this.callAI(batch, headers);
      } catch (error) {
        retries++;
        console.error(`Batch processing attempt ${retries} failed:`, error.message);
        
        if (retries >= this.maxRetries) {
          console.error('Max retries exceeded for batch');
          return batch.map(record => this.fallbackExtraction(record));
        }
        
        await this.delay(Math.pow(2, retries) * 1000);
      }
    }
    
    return batch.map(record => this.fallbackExtraction(record));
  }

  async callAI(batch, headers) {
    const prompt = this.buildPrompt(batch, headers);
    
    const result = await this.model.generateContent(
      this.getSystemPrompt() + '\n\n' + prompt
    );

    const content = result.response.text();
    const parsed = JSON.parse(content);
    
    return parsed.records || [];
  }

  getSystemPrompt() {
    return `You are a CRM data extraction specialist. Your task is to map CSV columns to CRM fields.

CRM Fields to extract (ALL fields must be present in output):
- created_at: Lead creation date (ISO 8601 format, e.g., 2026-05-13T14:20:48.000Z)
- name: Lead name
- email: Primary email address
- country_code: Country code (e.g., +91, +1, +44)
- mobile_without_country_code: Mobile number without country code (IMPORTANT: extract this field)
- company: Company name
- city: City
- state: State
- country: Country
- lead_owner: Lead owner email
- crm_status: One of [GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE] (IMPORTANT: extract this field)
- crm_note: Notes, remarks, follow-up notes, extra emails/phones (IMPORTANT: extract this field)
- data_source: One of [leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots]
- possession_time: Property possession time
- description: Additional description

Rules:
1. If multiple emails exist, use first as primary, append rest to crm_note
2. If multiple mobiles exist, use first as primary, append rest to crm_note
3. created_at must be valid JavaScript Date format (ISO 8601 preferred)
4. Only use allowed enum values for crm_status and data_source
5. If no confident match for enum fields, leave them empty string
6. Return empty string for missing fields, not null
7. Ensure each record is a single JSON object
8. Skip records that have neither email nor mobile by including them in skipped array
9. CRITICAL: Always extract mobile_without_country_code from phone/mobile columns
10. CRITICAL: Always extract crm_status from status/lead status columns
11. CRITICAL: Always extract crm_note from notes/remarks/comments columns

Response format (JSON):
{
  "records": [
    {
      "created_at": "2026-05-13T14:20:48.000Z",
      "name": "John Doe",
      "email": "john@example.com",
      "country_code": "+91",
      "mobile_without_country_code": "9876543210",
      "company": "GrowEasy",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "lead_owner": "test@gmail.com",
      "crm_status": "GOOD_LEAD_FOLLOW_UP",
      "crm_note": "Client is asking to reschedule demo",
      "data_source": "",
      "possession_time": "",
      "description": ""
    }
  ],
  "skipped": [
    {
      "reason": "No email or mobile number found",
      "originalData": {...}
    }
  ]
}`;
  }

  buildPrompt(batch, headers) {
    return `CSV Headers: ${headers.join(', ')}

Records to process (${batch.length} records):
${JSON.stringify(batch, null, 2)}

Extract CRM fields from these records following the system instructions. Return valid JSON with "records" and "skipped" arrays.`;
  }

  createBatches(array, size) {
    const batches = [];
    for (let i = 0; i < array.length; i += size) {
      batches.push(array.slice(i, i + size));
    }
    return batches;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  fallbackExtraction(record) {
    const keys = Object.keys(record);
    const result = {
      created_at: '',
      name: '',
      email: '',
      country_code: '',
      mobile_without_country_code: '',
      company: '',
      city: '',
      state: '',
      country: '',
      lead_owner: '',
      crm_status: '',
      crm_note: '',
      data_source: '',
      possession_time: '',
      description: ''
    };

    keys.forEach(key => {
      const lowerKey = key.toLowerCase();
      const value = record[key] || '';

      if (lowerKey.includes('name') && !lowerKey.includes('company')) {
        result.name = value;
      } else if (lowerKey.includes('email') || lowerKey.includes('mail')) {
        result.email = value;
      } else if (lowerKey.includes('phone') || lowerKey.includes('mobile')) {
        result.mobile_without_country_code = value.replace(/\D/g, '');
      } else if (lowerKey.includes('company') || lowerKey.includes('organization')) {
        result.company = value;
      } else if (lowerKey.includes('city')) {
        result.city = value;
      } else if (lowerKey.includes('state') || lowerKey.includes('province')) {
        result.state = value;
      } else if (lowerKey.includes('country')) {
        result.country = value;
      } else if (lowerKey.includes('date') || lowerKey.includes('time')) {
        result.created_at = value;
      } else if (lowerKey.includes('note') || lowerKey.includes('remark') || lowerKey.includes('comment')) {
        result.crm_note = value;
      }
    });

    return result;
  }
}

module.exports = new AIExtractionService();
