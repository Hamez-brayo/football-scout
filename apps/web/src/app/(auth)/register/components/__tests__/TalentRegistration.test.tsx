import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { UserTypeSelection } from '../RegistrationForm/UserTypeSelection';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock framer-motion to avoid animation-related issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  }
}));

// Mock icons
jest.mock('react-icons/fa', () => ({
  FaFutbol: () => <span data-testid="football-icon" className="text-indigo-400">⚽</span>,
  FaUserTie: () => <span data-testid="agent-icon" className="text-indigo-400">👔</span>,
  FaBuilding: () => <span data-testid="club-icon" className="text-indigo-400">🏢</span>
}));

describe('Talent Registration Flow', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('allows user to select talent type and proceed', async () => {
    render(<UserTypeSelection />);

    // Check if all user type options are displayed
    expect(screen.getByText('Player/Talent')).toBeInTheDocument();
    expect(screen.getByText('Create your player profile and showcase your skills')).toBeInTheDocument();

    // Select the talent option
    const talentButton = screen.getByText('Player/Talent').closest('button');
    fireEvent.click(talentButton!);

    // Check if continue button appears
    const continueButton = screen.getByText('Continue');
    expect(continueButton).toBeInTheDocument();

    // Click continue and verify navigation
    fireEvent.click(continueButton);
    expect(mockRouter.push).toHaveBeenCalledWith('/register/talent');
  });

  it('highlights selected option correctly', () => {
    render(<UserTypeSelection />);

    const talentButton = screen.getByText('Player/Talent').closest('button');
    fireEvent.click(talentButton!);

    // Check if the selected option has the correct styling
    expect(talentButton).toHaveClass('bg-indigo-600');
    expect(talentButton).toHaveClass('ring-2');
    expect(talentButton).toHaveClass('ring-indigo-500');
  });

  it('shows correct icon colors based on selection', () => {
    render(<UserTypeSelection />);

    const talentIcon = screen.getByTestId('football-icon');
    expect(talentIcon).toHaveClass('text-indigo-400');

    const talentButton = screen.getByText('Player/Talent').closest('button');
    fireEvent.click(talentButton!);

    expect(talentIcon).toHaveClass('text-white');
  });
}); 