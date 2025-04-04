import '@testing-library/jest-dom';
import React from 'react';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  UserIcon: () => <div data-testid="user-icon" />,
  BriefcaseIcon: () => <div data-testid="briefcase-icon" />,
  BuildingOffice2Icon: () => <div data-testid="building-icon" />,
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaFutbol: () => <div data-testid="football-icon" />,
  FaUserTie: () => <div data-testid="user-tie-icon" />,
  FaBuilding: () => <div data-testid="building-icon" />,
}));

// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-uid', email: 'test@example.com' },
    loading: false,
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

// Mock RegistrationContext
jest.mock('@/contexts/RegistrationContext', () => require('../src/contexts/__mocks__/RegistrationContext'));

// Mock ThemeContext
jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }) => <div>{children}</div>,
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  }
}));

// Mock heroicons
jest.mock('@heroicons/react/24/solid', () => ({
  CheckIcon: () => <span data-testid="check-icon">✓</span>
}));

// Mock heroicons outline
jest.mock('@heroicons/react/24/outline', () => ({
  UserIcon: () => <span data-testid="user-icon">👤</span>,
  BriefcaseIcon: () => <span data-testid="briefcase-icon">💼</span>,
  BuildingOffice2Icon: () => <span data-testid="building-icon">🏢</span>
}));

// Mock icons
jest.mock('react-icons/fa', () => ({
  FaFutbol: () => <span data-testid="football-icon" className="text-indigo-400">⚽</span>,
  FaUserTie: () => <span data-testid="agent-icon" className="text-indigo-400">👔</span>,
  FaBuilding: () => <span data-testid="club-icon" className="text-indigo-400">🏢</span>
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value?.toString() || ''; }),
    removeItem: jest.fn(key => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn()
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => ({ get: jest.fn() }))
}));

// Create a simplified test environment
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;
window.scrollTo = jest.fn(); 