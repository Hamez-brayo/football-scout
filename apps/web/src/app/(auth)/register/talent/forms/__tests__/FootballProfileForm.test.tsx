import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FootballProfileForm from '../FootballProfileForm';
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
    footballProfile: {},
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

describe('FootballProfileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    renderWithContext(<FootballProfileForm />);
    
    expect(screen.getByLabelText(/Current Club/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Primary Position/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Secondary Positions/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Playing Style/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Experience Level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Key Achievements/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithContext(<FootballProfileForm />);
    
    // Try to submit empty form
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    // Check for error messages
    await waitFor(() => {
      expect(screen.getByText(/Primary position is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Experience level is required/i)).toBeInTheDocument();
    });
  });

  it('allows selection of position options', async () => {
    renderWithContext(<FootballProfileForm />);
    
    const positionSelect = screen.getByLabelText(/Primary Position/i);
    
    // Test each position option
    ['goalkeeper', 'defender', 'midfielder', 'forward'].forEach(position => {
      fireEvent.change(positionSelect, { target: { value: position } });
      expect(positionSelect).toHaveValue(position);
    });
  });

  it('allows selection of experience level', async () => {
    renderWithContext(<FootballProfileForm />);
    
    const experienceSelect = screen.getByLabelText(/Experience Level/i);
    
    // Test each experience level option
    ['amateur', 'semi-professional', 'professional', 'youth'].forEach(level => {
      fireEvent.change(experienceSelect, { target: { value: level } });
      expect(experienceSelect).toHaveValue(level);
    });
  });

  it('allows selection of playing style', async () => {
    renderWithContext(<FootballProfileForm />);
    
    const styleSelect = screen.getByLabelText(/Playing Style/i);
    
    // Test each playing style option
    ['attacking', 'defensive', 'possession', 'counter-attacking', 'all-round'].forEach(style => {
      fireEvent.change(styleSelect, { target: { value: style } });
      expect(styleSelect).toHaveValue(style);
    });
  });

  it('submits valid form data', async () => {
    renderWithContext(<FootballProfileForm />);
    
    // Fill in valid data
    fireEvent.change(screen.getByLabelText(/Current Club/i), { 
      target: { value: 'Manchester United' }
    });
    
    fireEvent.change(screen.getByLabelText(/Primary Position/i), {
      target: { value: 'midfielder' }
    });
    
    fireEvent.change(screen.getByLabelText(/Secondary Positions/i), {
      target: { value: 'Right Wing, Attacking Mid' }
    });
    
    fireEvent.change(screen.getByLabelText(/Playing Style/i), {
      target: { value: 'attacking' }
    });
    
    fireEvent.change(screen.getByLabelText(/Experience Level/i), {
      target: { value: 'professional' }
    });
    
    fireEvent.change(screen.getByLabelText(/Key Achievements/i), {
      target: { value: 'Won league title, Top scorer' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(mockUpdateRegistrationData).toHaveBeenCalledWith({
        footballProfile: {
          currentClub: 'Manchester United',
          position: 'midfielder',
          secondaryPositions: 'Right Wing, Attacking Mid',
          playingStyle: 'attacking',
          experienceLevel: 'professional',
          achievements: 'Won league title, Top scorer',
        }
      });
    });
  });

  it('clears errors when user selects required fields', async () => {
    renderWithContext(<FootballProfileForm />);
    
    // Trigger errors
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Primary position is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Experience level is required/i)).toBeInTheDocument();
    });

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/Primary Position/i), {
      target: { value: 'midfielder' }
    });
    
    fireEvent.change(screen.getByLabelText(/Experience Level/i), {
      target: { value: 'professional' }
    });

    await waitFor(() => {
      expect(screen.queryByText(/Primary position is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Experience level is required/i)).not.toBeInTheDocument();
    });
  });

  it('preserves existing data from registration context', () => {
    const existingData = {
      ...defaultRegistrationContext,
      registrationData: {
        footballProfile: {
          currentClub: 'Existing Club',
          position: 'forward',
          secondaryPositions: 'Striker',
          playingStyle: 'attacking',
          experienceLevel: 'professional',
          achievements: 'Existing achievements',
        },
      },
    };

    renderWithContext(<FootballProfileForm />, existingData);
    
    // Verify existing data is displayed
    expect(screen.getByLabelText(/Current Club/i)).toHaveValue('Existing Club');
    expect(screen.getByLabelText(/Primary Position/i)).toHaveValue('forward');
    expect(screen.getByLabelText(/Secondary Positions/i)).toHaveValue('Striker');
    expect(screen.getByLabelText(/Playing Style/i)).toHaveValue('attacking');
    expect(screen.getByLabelText(/Experience Level/i)).toHaveValue('professional');
    expect(screen.getByLabelText(/Key Achievements/i)).toHaveValue('Existing achievements');
  });
}); 