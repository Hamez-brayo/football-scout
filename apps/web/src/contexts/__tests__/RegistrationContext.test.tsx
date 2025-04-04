import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { RegistrationProvider, useRegistration } from '../RegistrationContext';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Test components that use the context
const TestComponent = () => {
  const { currentStep } = useRegistration();
  return <div data-testid="current-step">{currentStep}</div>;
};

const UpdateDataComponent = () => {
  const { registrationData, updateRegistrationData } = useRegistration();
  return (
    <div>
      <div data-testid="name">{registrationData.basicInfo?.name || ''}</div>
      <button 
        onClick={() => updateRegistrationData({
          basicInfo: { name: 'John Doe' }
        })}
      >
        Update
      </button>
    </div>
  );
};

const NavigationComponent = () => {
  const { goToNextStep, goToPreviousStep } = useRegistration();
  return (
    <div>
      <button data-testid="next" onClick={goToNextStep}>Next</button>
      <button data-testid="prev" onClick={goToPreviousStep}>Previous</button>
    </div>
  );
};

const ProgressComponent = () => {
  const { progress, setUserType, updateRegistrationData } = useRegistration();
  return (
    <div>
      <div data-testid="progress">{progress}</div>
      <button 
        onClick={() => {
          setUserType('TALENT');
          updateRegistrationData({ userType: { type: 'TALENT' } });
        }}
      >
        Set User Type
      </button>
    </div>
  );
};

describe('RegistrationContext', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('provides context values to children', () => {
    render(
      <RegistrationProvider>
        <TestComponent />
      </RegistrationProvider>
    );
    expect(screen.getByTestId('current-step')).toHaveTextContent('0');
  });

  it('updates registration data correctly', () => {
    render(
      <RegistrationProvider>
        <UpdateDataComponent />
      </RegistrationProvider>
    );
    
    act(() => {
      fireEvent.click(screen.getByRole('button'));
    });
    
    expect(screen.getByTestId('name')).toHaveTextContent('John Doe');
  });

  it('handles navigation correctly', () => {
    render(
      <RegistrationProvider>
        <NavigationComponent />
      </RegistrationProvider>
    );
    
    // Previous should not navigate at step 0
    act(() => {
      fireEvent.click(screen.getByTestId('prev'));
    });
    expect(mockRouter.push).not.toHaveBeenCalled();
    
    // Next should not navigate when no user type is set
    act(() => {
      fireEvent.click(screen.getByTestId('next'));
    });
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('calculates progress correctly', () => {
    render(
      <RegistrationProvider>
        <ProgressComponent />
      </RegistrationProvider>
    );
    
    expect(screen.getByTestId('progress')).toHaveTextContent('0');
    
    act(() => {
      fireEvent.click(screen.getByRole('button'));
    });
    
    // After setting user type, progress should increase
    expect(screen.getByTestId('progress').textContent).not.toBe('0');
  });
});