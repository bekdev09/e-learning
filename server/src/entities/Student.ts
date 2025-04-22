import { Schema, Document, Model, Types, model } from 'mongoose';
import { User } from './User';

interface IStudent extends Document {
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
      subject: {
        type: String,
        required: true,
        enum: ['SAT', 'IELTS', 'PreSchool', 'President School', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Programming', 'Music', 'Art', 'Other'],
        index: true
      },          // e.g. "Mathematics", "Chemistry", "English"
      currentLevel: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: "Beginner"
      }, // e.g. "Beginner", "Intermediate", "Advanced"
      targetLevel: {
        type: String,
        enum: ['Intermediate', 'Advanced', 'Expert']
      },    // Optional goal level
      priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' }
    }],
    learningStyle: {
      visual: { type: Boolean, default: false },
      auditory: { type: Boolean, default: false },
      kinesthetic: { type: Boolean, default: false }
    },
    preferredFormat: {
      type: String,
      enum: ['1-on-1', 'group', 'self-paced'],
      default: '1-on-1'
    },
    availability: {
      timezone: {
        type: String,
        default: 'UTC+5'
      },
      weeklyHours: {
        type: Number,
        min: 1,
        max: 20,
        default: 5
      }
    },
    goals: [{
      description: { type: String, required: true },
      deadline: Date,
      isAchieved: { type: Boolean, default: false }
    }],

    isProfileCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Student: Model<IStudent> = model<IStudent>('Student', StudentSchema);

export default Student;