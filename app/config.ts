// Application configuration
export const config = {
  // Authentication configuration
  auth: {
    enabled: false, // Set to true to enable login/authentication
    providers: ['google', 'github', 'discord', 'facebook'], // Available auth providers
  },
  
  // Payment configuration
  payment: {
    enabled: false, // Set to true to enable payment verification
    minimumAmount: 499, // Minimum payment amount in cents ($4.99)
  },
  
  // App configuration
  app: {
    title: 'Navigation Quiz',
    description: 'Test your knowledge of navigation concepts',
  },
} as const;

export type Config = typeof config;
