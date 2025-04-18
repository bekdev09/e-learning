import { Types } from "mongoose";

export interface ITimestamps {
    createdAt: Date;
    updatedAt: Date;
}

export interface IGroupClassSettings {
    maxStudents: number;
    minStudents: number;
    pricingType: 'perStudent' | 'flatRate';
    price: number;
    discountRates?: {
        minStudents: number;
        discountPercentage: number;
    }[];
}

export const SUBJECT_CATEGORIES = [
    'Languages',
    'STEM',
    'Humanities',
    'Arts',
    'Test Prep',
    'Vocational'
] as const;

export const TEACHING_LEVELS = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'University',
    'Professional'
] as const;

interface ISubjectSpecialty {
    subject: string;
    category: typeof SUBJECT_CATEGORIES[number];
    levels: typeof TEACHING_LEVELS[number][];
    hourlyRate: number;
    trialRate?: number;
    curriculumStandards?: string[]; // e.g., ['IB', 'AP', 'SAT']
    materials?: {
        title: string;
        type: 'syllabus' | 'worksheet' | 'video';
        url: string;
    }[];
}

interface IAvailability {
    timezone: string; // e.g., "America/New_York"
    schedule: {
        day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
        slots: {
            start: string; // "14:00"
            end: string;   // "15:00"
            availableFor: Types.ObjectId[]; // Subject IDs
        }[];
    }[];
    exceptions?: {
        date: Date;
        reason: string;
        isAvailable: boolean;
    }[];
}
