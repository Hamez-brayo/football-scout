import { UserTypeSelection } from './components/RegistrationForm/UserTypeSelection';
import Link from 'next/link';

export const metadata = {
  title: 'Register - Football Scout',
  description: 'Join Football Scout as a player, agent, or club.',
};

export default function RegisterPage() {
  return (
    <div className="bg-[#0f0f0f]/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Create your account
        </h1>
        <p className="text-gray-400">
          Join us and start your journey
        </p>
      </div>

      {/* User Type Selection */}
      <UserTypeSelection />

      {/* Sign In Link */}
      <div className="mt-8 text-center">
        <Link 
          href="/sign-in"
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
} 