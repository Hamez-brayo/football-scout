import {
  basicInfoSchema,
  footballProfileSchema,
  achievementsSchema,
  mediaProfileSchema,
  talentRegistrationSchema,
  validateStep
} from '../schemas';

describe('Validation Schemas', () => {
  describe('Basic Info Schema', () => {
    it('validates valid basic info', () => {
      const validData = {
        fullName: 'John Doe',
        dateOfBirth: '2000-01-01',
        nationality: 'British',
        email: 'john@example.com',
        phone: '+1234567890',
        address: {
          country: 'United Kingdom',
          city: 'London',
          street: '123 Main St',
          postalCode: 'SW1A 1AA'
        }
      };

      const result = basicInfoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates required fields', () => {
      const invalidData = {
        fullName: '',
        dateOfBirth: '',
        nationality: '',
        email: 'invalid-email',
        address: {
          country: ''
        }
      };

      const result = basicInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ message: 'Full name must be at least 2 characters' }),
            expect.objectContaining({ message: 'Invalid email format' }),
            expect.objectContaining({ message: 'Nationality is required' }),
            expect.objectContaining({ message: 'Country is required' })
          ])
        );
      }
    });

    it('validates age restrictions', () => {
      const tooYoung = new Date();
      tooYoung.setFullYear(tooYoung.getFullYear() - 10);

      const tooOld = new Date();
      tooOld.setFullYear(tooOld.getFullYear() - 51);

      const invalidData = {
        ...validBasicInfo,
        dateOfBirth: tooYoung.toISOString().split('T')[0]
      };

      const result = basicInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Age must be between 12 and 50 years');
      }

      const invalidData2 = {
        ...validBasicInfo,
        dateOfBirth: tooOld.toISOString().split('T')[0]
      };

      const result2 = basicInfoSchema.safeParse(invalidData2);
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error.errors[0].message).toBe('Age must be between 12 and 50 years');
      }
    });
  });

  describe('Football Profile Schema', () => {
    it('validates valid football profile', () => {
      const validData = {
        position: 'Striker',
        secondaryPositions: ['Winger', 'Attacking Midfielder'],
        height: 180,
        weight: 75,
        preferredFoot: 'right',
        playingStyle: 'Technical',
        experienceLevel: 'professional',
        currentClub: 'FC Test'
      };

      const result = footballProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates required fields and ranges', () => {
      const invalidData = {
        position: '',
        height: 90,
        weight: 20,
        preferredFoot: 'middle' as any,
        experienceLevel: 'invalid' as any
      };

      const result = footballProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ message: 'Position is required' }),
            expect.objectContaining({ message: 'Height must be at least 100 cm' }),
            expect.objectContaining({ message: 'Weight must be at least 30 kg' }),
            expect.objectContaining({ message: 'Invalid enum value' })
          ])
        );
      }
    });
  });

  describe('Achievements Schema', () => {
    it('validates valid achievements', () => {
      const validData = {
        titles: ['League Champion 2022', 'Cup Winner 2023'],
        awards: ['Top Scorer 2022'],
        careerHighlights: ['Hat-trick in final'],
        statistics: [{
          season: '2022/23',
          goals: 20,
          assists: 15,
          appearances: 30
        }]
      };

      const result = achievementsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates optional fields', () => {
      const minimalData = {
        titles: [],
        statistics: [{
          season: '2022/23'
        }]
      };

      const result = achievementsSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });
  });

  describe('Media Profile Schema', () => {
    it('validates valid media profile', () => {
      const validData = {
        profilePhoto: 'photo.jpg',
        highlightVideo: 'https://youtube.com/watch?v=123',
        matchFootage: ['https://youtube.com/watch?v=456'],
        socialMedia: {
          instagram: 'https://instagram.com/player',
          twitter: 'https://twitter.com/player',
          youtube: 'https://youtube.com/channel/123'
        }
      };

      const result = mediaProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates required fields and URLs', () => {
      const invalidData = {
        profilePhoto: '',
        highlightVideo: 'invalid-url',
        matchFootage: ['not-a-url'],
        socialMedia: {
          instagram: 'not-a-url'
        }
      };

      const result = mediaProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ message: 'Profile photo is required' }),
            expect.objectContaining({ message: 'Invalid video URL' }),
            expect.objectContaining({ message: 'Invalid Instagram URL' })
          ])
        );
      }
    });
  });

  describe('Complete Talent Registration Schema', () => {
    it('validates complete valid registration', () => {
      const validData = {
        userType: 'TALENT',
        basicInfo: {
          fullName: 'John Doe',
          dateOfBirth: '2000-01-01',
          nationality: 'British',
          email: 'john@example.com',
          address: {
            country: 'United Kingdom'
          }
        },
        footballProfile: {
          position: 'Striker',
          height: 180,
          weight: 75,
          preferredFoot: 'right',
          experienceLevel: 'professional'
        },
        media: {
          profilePhoto: 'photo.jpg'
        },
        preferences: {
          visibility: 'public',
          contactPreference: 'email',
          notificationSettings: {
            email: true,
            push: true,
            sms: false
          }
        }
      };

      const result = talentRegistrationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('validateStep function', () => {
    it('validates basic-info step', async () => {
      const validData = {
        fullName: 'John Doe',
        dateOfBirth: '2000-01-01',
        nationality: 'British',
        email: 'john@example.com',
        address: {
          country: 'United Kingdom'
        }
      };

      const result = await validateStep('basic-info', validData);
      expect(result.success).toBe(true);
      expect(result.errors).toBeNull();
    });

    it('returns formatted errors for invalid data', async () => {
      const invalidData = {
        fullName: '',
        dateOfBirth: '',
        nationality: '',
        email: 'invalid-email',
        address: {
          country: ''
        }
      };

      const result = await validateStep('basic-info', invalidData);
      expect(result.success).toBe(false);
      expect(result.errors).toEqual(expect.objectContaining({
        fullName: expect.any(String),
        email: expect.any(String),
        nationality: expect.any(String),
        'address.country': expect.any(String)
      }));
    });

    it('handles invalid step ID', async () => {
      await expect(validateStep('invalid-step', {})).rejects.toThrow('Invalid step ID');
    });
  });
});

// Test data
const validBasicInfo = {
  fullName: 'John Doe',
  dateOfBirth: '2000-01-01',
  nationality: 'British',
  email: 'john@example.com',
  address: {
    country: 'United Kingdom'
  }
}; 