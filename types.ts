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
}

export interface UrgeLog {
  id: string;
  timestamp: string;
  intensity: number; // 1-10
  trigger: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface AlternativeMethod {
  title: string;
  description: string;
  suitability: string[];
}
