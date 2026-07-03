// Application-wide constants

export const APP_NAME = 'Career Guidance'

export const ACADEMIC_LEVELS = [
  'Seconde',
  'Première',
  'Terminale',
  'Nouveau Bachelier',
  'Autres',
] as const

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  RECOMMENDATIONS: '/recommendations',
  ROADMAP: '/roadmap',
  UNIVERSITIES: '/universities',
  CHATBOT: '/chatbot',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const
