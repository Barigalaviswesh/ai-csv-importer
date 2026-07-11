const { z } = require('zod');

class ValidationService {
  constructor() {
    this.crmRecordSchema = z.object({
      created_at: z.string().optional(),
      name: z.string().optional(),
      email: z.string().email().optional().or(z.literal('')),
      country_code: z.string().optional(),
      mobile_without_country_code: z.string().optional(),
      company: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      lead_owner: z.string().email().optional().or(z.literal('')),
      crm_status: z.enum(['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE']).optional().or(z.literal('')),
      crm_note: z.string().optional(),
      data_source: z.enum(['leads_on_demand', 'meridian_tower', 'eden_park', 'varah_swamy', 'sarjapur_plots']).optional().or(z.literal('')),
      possession_time: z.string().optional(),
      description: z.string().optional(),
    });
  }

  validateCRMRecord(record) {
    try {
      return this.crmRecordSchema.parse(record);
    } catch (error) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
  }

  hasContactInfo(record) {
    const hasEmail = record.email && record.email.trim() !== '';
    const hasMobile = record.mobile_without_country_code && record.mobile_without_country_code.trim() !== '';
    return hasEmail || hasMobile;
  }

  isValidDate(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
}

module.exports = new ValidationService();
