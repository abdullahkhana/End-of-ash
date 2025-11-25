export enum AddictionType {
  CIGARETTES = 'Cigarettes',
  DRUGS = 'Drugs',
  SELF_HARM = 'Self Harm',
  WEED = 'Weed',
  METH = 'Meth',
  PILLS = 'Pills',
  VAPE = 'Vape',
  ALCOHOL = 'Alcohol',
  OTHER = 'Other'
}

export enum QuitSpeed {
  COLD_TURKEY = 'Cold Turkey',
  GRADUAL = 'Gradual',
  REPLACEMENT = 'Replacement Therapy'
}

export interface SavingsGoal {
  id: string;
  name: string;
  cost: number;
  imageIcon?: string; // Icon name
}

export interface UserProfile {
  name: string;
  age: number;
  addiction: AddictionType;
  startDate: string; // ISO date string
  frequencyPerWeek: number;
  reminderTime: string; // HH:mm
  reasonForQuitting: string;
  quitSpeed: QuitSpeed;
  dailyCost?: number;
  savingsGoal?: SavingsGoal;
}

export interface UrgeLog {
  id: string;
  timestamp: string;
  intensity: number; // 1-10
  trigger: string;
  notes?: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  title: string;
  content: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface HealthMilestone {
  day: number;
  title: string;
  description: string;
  percentage: number; // 0-100 calculated at runtime
}

export interface AlternativeMethod {
  title: string;
  description: string;
  suitability: string[];
}