const validationService = require('../validation.service');

describe('ValidationService', () => {
  test('should validate valid CRM record', () => {
    const validRecord = {
      created_at: '2026-07-11T10:30:00.000Z',
      name: 'John Doe',
      email: 'john@example.com',
      country_code: '+91',
      mobile_without_country_code: '9876543210',
      company: 'Test Company',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      lead_owner: 'owner@example.com',
      crm_status: 'GOOD_LEAD_FOLLOW_UP',
      crm_note: 'Test note',
      data_source: 'leads_on_demand',
      possession_time: '',
      description: ''
    };

    const result = validationService.validateCRMRecord(validRecord);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should reject invalid email', () => {
    const invalidRecord = {
      email: 'invalid-email',
      mobile_without_country_code: '9876543210'
    };

    const result = validationService.validateCRMRecord(invalidRecord);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('should reject invalid crm_status', () => {
    const invalidRecord = {
      email: 'test@example.com',
      crm_status: 'INVALID_STATUS'
    };

    const result = validationService.validateCRMRecord(invalidRecord);
    expect(result.success).toBe(false);
  });

  test('should reject invalid data_source', () => {
    const invalidRecord = {
      email: 'test@example.com',
      data_source: 'invalid_source'
    };

    const result = validationService.validateCRMRecord(invalidRecord);
    expect(result.success).toBe(false);
  });

  test('should check for required contact info', () => {
    const noContactRecord = {
      name: 'John Doe'
    };

    const hasContact = validationService.hasRequiredContactInfo(noContactRecord);
    expect(hasContact).toBe(false);
  });

  test('should accept record with email only', () => {
    const emailOnlyRecord = {
      email: 'test@example.com'
    };

    const hasContact = validationService.hasRequiredContactInfo(emailOnlyRecord);
    expect(hasContact).toBe(true);
  });

  test('should accept record with mobile only', () => {
    const mobileOnlyRecord = {
      mobile_without_country_code: '9876543210'
    };

    const hasContact = validationService.hasRequiredContactInfo(mobileOnlyRecord);
    expect(hasContact).toBe(true);
  });
});
