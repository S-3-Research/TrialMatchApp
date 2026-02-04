export type UserRole = 'user' | 'caregiver';
export type ResponseStyle = 'concise' | 'balanced' | 'verbose';
export type UserIntent = 'trial_matching' | 'learn_about_trials';

export interface IntakeData {
  role: UserRole;
  response_style: ResponseStyle;
  intent: UserIntent;
  completed_at?: string;
}

export const INTAKE_STORAGE_KEY = 'intake_data';
