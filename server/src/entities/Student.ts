import  { Schema, Document, Model, Types, model } from 'mongoose';
import { ITimestamps } from './Shared';
import { User } from './User';

interface IStudent extends Document, ITimestamps{
    user: Types.ObjectId | typeof User;
    
    subjects: {
      subject: string;          // e.g. "Mathematics", "Chemistry", "English"
      currentLevel: string;     // e.g. "Beginner", "Intermediate", "Advanced"
      targetLevel?: string;     // Optional goal level
      priority: 'high' | 'medium' | 'low';
    }[];
    
    // Learning Preferences
    learningStyle?: {
      visual: boolean;
      auditory: boolean;
      kinesthetic: boolean;
    };
    preferredFormat?: '1-on-1' | 'group' | 'self-paced';
    availability: {
      timezone: string;
      weeklyHours: number;      // Total hours student can commit per week
    };
  
    // Progress Tracking
    goals?: {
      description: string;
      deadline?: Date;
      isAchieved: boolean;
    }[];
  
    // System
    isProfileCompleted: boolean;
  }

const StudentSchema: Schema = new Schema<IStudent>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true 
        },
        subjects: [{
            
        }]
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const Student: Model<IStudent> = model<IStudent>('Student', StudentSchema);

export default Student;