import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { RegistrationProvider } from '@/contexts/RegistrationContext';
import { BasicInfoForm } from '../forms/BasicInfoForm';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

describe('BasicInfoForm', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders all required fields', () => {
    render(
      <RegistrationProvider>
        <BasicInfoForm />
      </RegistrationProvider>
    );

    // Check for form fields
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nationality/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <RegistrationProvider>
        <BasicInfoForm />
      </RegistrationProvider>
    );

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(submitButton);

    // Check for error messages
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/date of birth is required/i)).toBeInTheDocument();
      expect(screen.getByText(/nationality is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(
      <RegistrationProvider>
        <BasicInfoForm />
      </RegistrationProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('validates age requirement', async () => {
    render(
      <RegistrationProvider>
        <BasicInfoForm />
      </RegistrationProvider>
    );

    const dobInput = screen.getByLabelText(/date of birth/i);
    // Set date to less than 16 years ago
    const tooYoungDate = new Date();
    tooYoungDate.setFullYear(tooYoungDate.getFullYear() - 15);
    fireEvent.change(dobInput, { target: { value: tooYoungDate.toISOString().split('T')[0] } });
    
    const submitButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/must be at least 16 years old/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(
      <RegistrationProvider>
        <BasicInfoForm />
      </RegistrationProvider>
    );

    // Fill in valid data
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    
    const validDate = new Date();
    validDate.setFullYear(validDate.getFullYear() - 20);
    fireEvent.change(screen.getByLabelText(/date of birth/i), { 
      target: { value: validDate.toISOString().split('T')[0] } 
    });
    
    fireEvent.change(screen.getByLabelText(/nationality/i), { target: { value: 'British' } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '+44123456789' } });

    const submitButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(submitButton);

    // Should navigate to next step
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/register/talent/experience');
    });
  });

  it('clears errors when fields are updated', async () => {
    render(
      <RegistrationProvider>
        <BasicInfoForm />
      </RegistrationProvider>
    );

    // Submit empty form to trigger errors
    const submitButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(submitButton);

    // Wait for error messages
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });

    // Update field
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
    });
  });
}); 