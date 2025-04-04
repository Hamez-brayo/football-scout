import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRegistration } from '@/contexts/RegistrationContext';
import BaseForm from '../BaseForm';

// Mock the registration context
jest.mock('@/contexts/RegistrationContext', () => ({
  useRegistration: jest.fn()
}));

// Create a test wrapper component
const TestWrapper = ({ children }) => {
  return (
    <div data-testid="test-wrapper">
      {children}
    </div>
  );
};

describe('BaseForm', () => {
  const mockGoToNextStep = jest.fn();
  const mockGoToPreviousStep = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRegistration as jest.Mock).mockReturnValue({
      currentStep: 1,
      totalSteps: 3,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
      currentStepData: {
        title: 'Test Step',
        description: 'Test Description'
      },
      progress: 33
    });
  });

  const renderWithWrapper = (ui) => {
    return render(ui, { wrapper: TestWrapper });
  };

  it('renders form with children', () => {
    renderWithWrapper(
      <BaseForm onSubmit={mockOnSubmit}>
        <div>Test Content</div>
      </BaseForm>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Test Step')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders progress bar with correct width', () => {
    renderWithWrapper(
      <BaseForm onSubmit={mockOnSubmit}>
        <div>Test Content</div>
      </BaseForm>
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle({ width: '33%' });
  });

  it('handles form submission', async () => {
    renderWithWrapper(
      <BaseForm onSubmit={mockOnSubmit}>
        <div>Test Content</div>
      </BaseForm>
    );

    const submitButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockGoToNextStep).toHaveBeenCalled();
    });
  });

  it('disables submit button when form is invalid', () => {
    renderWithWrapper(
      <BaseForm onSubmit={mockOnSubmit} isValid={false}>
        <div>Test Content</div>
      </BaseForm>
    );

    const submitButton = screen.getByRole('button', { name: /continue/i });
    expect(submitButton).toBeDisabled();
  });

  it('shows loading state during submission', async () => {
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithWrapper(
      <BaseForm onSubmit={mockOnSubmit}>
        <div>Test Content</div>
      </BaseForm>
    );

    const submitButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/processing/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByText(/processing/i)).not.toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('handles navigation between steps', () => {
    renderWithWrapper(
      <BaseForm onSubmit={mockOnSubmit}>
        <div>Test Content</div>
      </BaseForm>
    );

    const previousButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(previousButton);
    expect(mockGoToPreviousStep).toHaveBeenCalled();
  });

  it('disables previous button on first step', () => {
    (useRegistration as jest.Mock).mockReturnValue({
      currentStep: 0,
      totalSteps: 3,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
      currentStepData: {
        title: 'Test Step',
        description: 'Test Description'
      },
      progress: 0
    });

    renderWithWrapper(
      <BaseForm onSubmit={mockOnSubmit}>
        <div>Test Content</div>
      </BaseForm>
    );

    const previousButton = screen.getByRole('button', { name: /previous/i });
    expect(previousButton).toBeDisabled();
  });

  it('shows complete registration text on last step', () => {
    (useRegistration as jest.Mock).mockReturnValue({
      currentStep: 2,
      totalSteps: 3,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
      currentStepData: {
        title: 'Test Step',
        description: 'Test Description'
      },
      progress: 66
    });

    renderWithWrapper(
      <BaseForm onSubmit={mockOnSubmit}>
        <div>Test Content</div>
      </BaseForm>
    );

    expect(screen.getByRole('button', { name: /complete registration/i })).toBeInTheDocument();
  });

  it('handles submission errors gracefully', async () => {
    const mockError = new Error('Submission failed');
    mockOnSubmit.mockRejectedValue(mockError);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    renderWithWrapper(
      <BaseForm onSubmit={mockOnSubmit}>
        <div>Test Content</div>
      </BaseForm>
    );

    const submitButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Form submission error:', mockError);
      expect(submitButton).not.toBeDisabled();
    });

    consoleSpy.mockRestore();
  });

  it('hides navigation when showNavigation is false', () => {
    renderWithWrapper(
      <BaseForm onSubmit={mockOnSubmit} showNavigation={false}>
        <div>Test Content</div>
      </BaseForm>
    );

    expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument();
  });
}); 