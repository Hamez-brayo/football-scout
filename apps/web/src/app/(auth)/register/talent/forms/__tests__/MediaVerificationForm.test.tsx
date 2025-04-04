import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MediaVerificationForm from '../MediaVerificationForm';
import { useRegistration } from '@/contexts/RegistrationContext';

const mockUpdateRegistrationData = jest.fn();
const mockGoToNextStep = jest.fn();
const mockGoToPreviousStep = jest.fn();

jest.mock('@/contexts/RegistrationContext', () => ({
  useRegistration: jest.fn(),
}));

const defaultRegistrationContext = {
  updateRegistrationData: mockUpdateRegistrationData,
  registrationData: {
    media: {},
  },
  goToNextStep: mockGoToNextStep,
  goToPreviousStep: mockGoToPreviousStep,
  currentStep: 1,
  totalSteps: 3,
};

const renderWithContext = (ui: React.ReactElement, contextValue = defaultRegistrationContext) => {
  (useRegistration as jest.Mock).mockImplementation(() => contextValue);
  return render(ui);
};

describe('MediaVerificationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    renderWithContext(<MediaVerificationForm />);
    
    expect(screen.getByLabelText(/Profile Photo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Highlight Video URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Match Footage URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Instagram/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Twitter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/YouTube/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Certificates/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Other Documents/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Additional Information/i)).toBeInTheDocument();
  });

  it('validates required profile photo', async () => {
    renderWithContext(<MediaVerificationForm />);
    
    // Try to submit without profile photo
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText(/Profile photo is required/i)).toBeInTheDocument();
    });
  });

  it('validates social media URLs', async () => {
    renderWithContext(<MediaVerificationForm />);
    
    // Test invalid Instagram URL
    fireEvent.change(screen.getByLabelText(/Instagram/i), {
      target: { value: 'invalid-url' }
    });
    
    // Test invalid Twitter URL
    fireEvent.change(screen.getByLabelText(/Twitter/i), {
      target: { value: 'not-a-url' }
    });
    
    // Test invalid YouTube URL
    fireEvent.change(screen.getByLabelText(/YouTube/i), {
      target: { value: 'wrong-format' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid URL/i)).toBeInTheDocument();
    });
  });

  it('handles file uploads correctly', async () => {
    renderWithContext(<MediaVerificationForm />);
    
    const profilePhotoInput = screen.getByLabelText(/Profile Photo/i);
    const certificatesInput = screen.getByLabelText(/Certificates/i);
    const documentsInput = screen.getByLabelText(/Other Documents/i);

    const photoFile = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' });
    const certificateFile = new File(['cert'], 'cert.pdf', { type: 'application/pdf' });
    const documentFile = new File(['doc'], 'doc.pdf', { type: 'application/pdf' });

    Object.defineProperty(profilePhotoInput, 'files', {
      value: [photoFile],
    });
    fireEvent.change(profilePhotoInput);

    Object.defineProperty(certificatesInput, 'files', {
      value: [certificateFile],
    });
    fireEvent.change(certificatesInput);

    Object.defineProperty(documentsInput, 'files', {
      value: [documentFile],
    });
    fireEvent.change(documentsInput);

    expect(profilePhotoInput.files[0]).toBe(photoFile);
    expect(certificatesInput.files[0]).toBe(certificateFile);
    expect(documentsInput.files[0]).toBe(documentFile);
  });

  it('submits valid form data', async () => {
    renderWithContext(<MediaVerificationForm />);
    
    // Fill in valid data
    const photoFile = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' });
    Object.defineProperty(screen.getByLabelText(/Profile Photo/i), 'files', {
      value: [photoFile],
    });
    fireEvent.change(screen.getByLabelText(/Profile Photo/i));
    
    fireEvent.change(screen.getByLabelText(/Highlight Video URL/i), {
      target: { value: 'https://youtube.com/watch?v=123' }
    });
    
    fireEvent.change(screen.getByLabelText(/Match Footage URL/i), {
      target: { value: 'https://vimeo.com/123456' }
    });
    
    fireEvent.change(screen.getByLabelText(/Instagram/i), {
      target: { value: 'https://instagram.com/player' }
    });
    
    fireEvent.change(screen.getByLabelText(/Twitter/i), {
      target: { value: 'https://twitter.com/player' }
    });
    
    fireEvent.change(screen.getByLabelText(/YouTube/i), {
      target: { value: 'https://youtube.com/channel/123' }
    });
    
    fireEvent.change(screen.getByLabelText(/Additional Information/i), {
      target: { value: 'Additional details about my career' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(mockUpdateRegistrationData).toHaveBeenCalledWith({
        media: {
          profilePhoto: 'photo.jpg',
          highlightVideo: 'https://youtube.com/watch?v=123',
          matchFootage: 'https://vimeo.com/123456',
          certificates: [],
          documents: [],
          socialMedia: {
            instagram: 'https://instagram.com/player',
            twitter: 'https://twitter.com/player',
            youtube: 'https://youtube.com/channel/123',
          },
          additionalInfo: 'Additional details about my career',
        }
      });
    });
  });

  it('preserves existing data from registration context', () => {
    const existingData = {
      ...defaultRegistrationContext,
      registrationData: {
        media: {
          highlightVideo: 'https://youtube.com/existing',
          matchFootage: 'https://vimeo.com/existing',
          socialMedia: {
            instagram: 'https://instagram.com/existing',
            twitter: 'https://twitter.com/existing',
            youtube: 'https://youtube.com/existing',
          },
          additionalInfo: 'Existing info',
        },
      },
    };

    renderWithContext(<MediaVerificationForm />, existingData);
    
    // Verify existing data is displayed
    expect(screen.getByLabelText(/Highlight Video URL/i)).toHaveValue('https://youtube.com/existing');
    expect(screen.getByLabelText(/Match Footage URL/i)).toHaveValue('https://vimeo.com/existing');
    expect(screen.getByLabelText(/Instagram/i)).toHaveValue('https://instagram.com/existing');
    expect(screen.getByLabelText(/Twitter/i)).toHaveValue('https://twitter.com/existing');
    expect(screen.getByLabelText(/YouTube/i)).toHaveValue('https://youtube.com/existing');
    expect(screen.getByLabelText(/Additional Information/i)).toHaveValue('Existing info');
  });

  it('clears errors when user provides valid input', async () => {
    renderWithContext(<MediaVerificationForm />);
    
    // Trigger error with invalid URL
    fireEvent.change(screen.getByLabelText(/Instagram/i), {
      target: { value: 'invalid-url' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid URL/i)).toBeInTheDocument();
    });

    // Fix the URL
    fireEvent.change(screen.getByLabelText(/Instagram/i), {
      target: { value: 'https://instagram.com/valid' }
    });
    
    await waitFor(() => {
      expect(screen.queryByText(/Please enter a valid URL/i)).not.toBeInTheDocument();
    });
  });
}); 