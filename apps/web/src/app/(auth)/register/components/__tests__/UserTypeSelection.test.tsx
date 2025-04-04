import { render, screen, fireEvent } from '@testing-library/react';
import UserTypeSelection from '../UserTypeSelection';
import { useRegistration } from '@/contexts/RegistrationContext';
import { useRouter } from 'next/navigation';

const mockSetUserType = jest.fn();
const mockUpdateRegistrationData = jest.fn();
const mockMarkStepComplete = jest.fn();
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/RegistrationContext', () => ({
  useRegistration: jest.fn(),
}));

describe('UserTypeSelection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRegistration as jest.Mock).mockImplementation(() => ({
      setUserType: mockSetUserType,
      updateRegistrationData: mockUpdateRegistrationData,
      markStepComplete: mockMarkStepComplete,
    }));
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
    }));
  });

  it('renders all user type options', () => {
    render(<UserTypeSelection />);
    
    expect(screen.getByText(/Player\/Talent/i)).toBeInTheDocument();
    expect(screen.getByText(/Agent\/Scout/i)).toBeInTheDocument();
    expect(screen.getByText(/Club/i)).toBeInTheDocument();
  });

  it('displays correct descriptions for each user type', () => {
    render(<UserTypeSelection />);
    
    expect(screen.getByText(/I am a football player looking to showcase my talent/i)).toBeInTheDocument();
    expect(screen.getByText(/I represent and scout football talent/i)).toBeInTheDocument();
    expect(screen.getByText(/I represent a football club or organization/i)).toBeInTheDocument();
  });

  it('handles talent selection correctly', () => {
    render(<UserTypeSelection />);
    
    fireEvent.click(screen.getByText(/Player\/Talent/i));
    
    expect(mockSetUserType).toHaveBeenCalledWith('TALENT');
    expect(mockUpdateRegistrationData).toHaveBeenCalledWith({ userType: 'TALENT' });
    expect(mockMarkStepComplete).toHaveBeenCalledWith('user-type');
    expect(mockPush).toHaveBeenCalledWith('/register/talent');
  });

  it('handles agent selection correctly', () => {
    render(<UserTypeSelection />);
    
    fireEvent.click(screen.getByText(/Agent\/Scout/i));
    
    expect(mockSetUserType).toHaveBeenCalledWith('AGENT');
    expect(mockUpdateRegistrationData).toHaveBeenCalledWith({ userType: 'AGENT' });
    expect(mockMarkStepComplete).toHaveBeenCalledWith('user-type');
    expect(mockPush).toHaveBeenCalledWith('/register/agent');
  });

  it('handles club selection correctly', () => {
    render(<UserTypeSelection />);
    
    fireEvent.click(screen.getByText(/Club/i));
    
    expect(mockSetUserType).toHaveBeenCalledWith('CLUB');
    expect(mockUpdateRegistrationData).toHaveBeenCalledWith({ userType: 'CLUB' });
    expect(mockMarkStepComplete).toHaveBeenCalledWith('user-type');
    expect(mockPush).toHaveBeenCalledWith('/register/club');
  });

  it('renders icons for each user type', () => {
    render(<UserTypeSelection />);
    
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    expect(screen.getByTestId('briefcase-icon')).toBeInTheDocument();
    expect(screen.getByTestId('building-icon')).toBeInTheDocument();
  });

  it('applies hover styles to buttons', () => {
    render(<UserTypeSelection />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveClass('hover:border-indigo-500');
    });
  });

  it('handles keyboard navigation', () => {
    render(<UserTypeSelection />);
    
    const buttons = screen.getAllByRole('button');
    
    // Test Tab navigation
    buttons[0].focus();
    expect(document.activeElement).toBe(buttons[0]);
    
    fireEvent.keyDown(buttons[0], { key: 'Tab' });
    expect(document.activeElement).toBe(buttons[1]);
    
    fireEvent.keyDown(buttons[1], { key: 'Tab' });
    expect(document.activeElement).toBe(buttons[2]);
  });

  it('handles Enter key selection', () => {
    render(<UserTypeSelection />);
    
    const talentButton = screen.getByText(/Player\/Talent/i);
    talentButton.focus();
    fireEvent.keyDown(talentButton, { key: 'Enter' });
    
    expect(mockSetUserType).toHaveBeenCalledWith('TALENT');
    expect(mockUpdateRegistrationData).toHaveBeenCalledWith({ userType: 'TALENT' });
  });

  it('maintains focus styles', () => {
    render(<UserTypeSelection />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      button.focus();
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
    });
  });

  it('handles error in navigation', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockPushWithError = jest.fn().mockRejectedValue(new Error('Navigation failed'));
    
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPushWithError,
    }));

    render(<UserTypeSelection />);
    
    fireEvent.click(screen.getByText(/Player\/Talent/i));
    
    expect(mockPushWithError).toHaveBeenCalled();
    expect(mockConsoleError).toHaveBeenCalled();
    
    mockConsoleError.mockRestore();
  });

  it('prevents multiple rapid selections', () => {
    render(<UserTypeSelection />);
    
    const talentButton = screen.getByText(/Player\/Talent/i);
    
    // Click multiple times rapidly
    fireEvent.click(talentButton);
    fireEvent.click(talentButton);
    fireEvent.click(talentButton);
    
    // Should only call the handlers once
    expect(mockSetUserType).toHaveBeenCalledTimes(1);
    expect(mockUpdateRegistrationData).toHaveBeenCalledTimes(1);
    expect(mockMarkStepComplete).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
}); 