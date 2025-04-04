import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BasicInfoForm } from '../BasicInfoForm';
import { RegistrationContext } from '@/contexts/RegistrationContext';
import { FormProvider, useForm } from 'react-hook-form';

const TestWrapper = ({ children }) => {
  const methods = useForm({
    defaultValues: {
      basicInfo: {
        name: '',
        email: '',
        dateOfBirth: '',
        nationality: ''
      }
    }
  });

  return (
    <RegistrationContext.Provider
      value={{
        currentStep: 'basicInfo',
        visibleSteps: ['userType', 'basicInfo', 'profile', 'media'],
        isStepComplete: () => false,
        progress: 25,
        registrationData: {},
        updateRegistrationData: jest.fn(),
        goToNextStep: jest.fn(),
        goToPreviousStep: jest.fn(),
        isFirstStep: false,
        isLastStep: false
      }}
    >
      <FormProvider {...methods}>
        {children}
      </FormProvider>
    </RegistrationContext.Provider>
  );
};

const renderWithWrapper = (ui) => {
  return render(ui, { wrapper: TestWrapper });
};

describe('BasicInfoForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all required fields', () => {
    renderWithWrapper(<BasicInfoForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nationality/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithWrapper(<BasicInfoForm />);
    
    const submitButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/date of birth is required/i)).toBeInTheDocument();
      expect(screen.getByText(/nationality is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    renderWithWrapper(<BasicInfoForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('validates age range', async () => {
    renderWithWrapper(<BasicInfoForm />);
    
    const dobInput = screen.getByLabelText(/date of birth/i);
    fireEvent.change(dobInput, { target: { value: '2020-01-01' } });
    
    const submitButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/you must be at least 13 years old/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const mockUpdateData = jest.fn();
    const mockGoToNext = jest.fn();

    const CustomWrapper = ({ children }) => {
      const methods = useForm({
        defaultValues: {
          basicInfo: {
            name: '',
            email: '',
            dateOfBirth: '',
            nationality: ''
          }
        }
      });

      return (
        <RegistrationContext.Provider
          value={{
            currentStep: 'basicInfo',
            visibleSteps: ['userType', 'basicInfo', 'profile', 'media'],
            isStepComplete: () => false,
            progress: 25,
            registrationData: {},
            updateRegistrationData: mockUpdateData,
            goToNextStep: mockGoToNext,
            goToPreviousStep: jest.fn(),
            isFirstStep: false,
            isLastStep: false
          }}
        >
          <FormProvider {...methods}>
            {children}
          </FormProvider>
        </RegistrationContext.Provider>
      );
    };

    render(<BasicInfoForm />, { wrapper: CustomWrapper });

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/nationality/i), { target: { value: 'British' } });

    const submitButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateData).toHaveBeenCalledWith({
        basicInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          dateOfBirth: '2000-01-01',
          nationality: 'British'
        }
      });
      expect(mockGoToNext).toHaveBeenCalled();
    });
  });

  it('clears errors when fields are updated', async () => {
    renderWithWrapper(<BasicInfoForm />);
    
    const submitButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });

    await waitFor(() => {
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
    });
  });
}); 