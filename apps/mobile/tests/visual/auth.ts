export const useAuth = () => ({
  logout: async () => {
    throw new Error('Fixture session: real sign-out is not exercised.');
  },
});
