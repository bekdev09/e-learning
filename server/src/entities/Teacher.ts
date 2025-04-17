import { Schema, model, Document, Types } from "mongoose";
import { User } from "./User";

interface ITeacher extends Document {
  user: Types.ObjectId | typeof User;
  bio: string;
  specialities: string[]
  teachingStyle?: string
  educaton: {
    degree: string
    university: string
    graduationYear: string
  }[]
  experience: {
    position: string;
    institution: string;
    years: number;
  }[];
  certificates: string[];
  hourlRate: number
  trialRate?: number
  availibility: {
    timezone: string
    schedule: {
      day: string
      slots: string[]
    }
  }
  isProfileCompleted: boolean
  createdAt: Date
  updatedAt: Date
}

const TeacherSchema = new Schema<ITeacher>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, 'Foydalanuvchi bog\'lanishi majburiy'],
    unique: true,
    index: true
  },
  bio: {
    type: String,
    required: [true, 'Bio majburiy'],
    minlength: [100, 'Bio kamida 100 ta belgidan iborat bo\'lishi kerak'],
    maxlength: [1000, 'Bio 1000 ta belgidan oshmasligi kerak']
  },
  specialities: {
    type: [String],
    required: [true, 'Mutaxassisliklar majburiy'],
    validate: {
      validator: (v: string[]) => v.length >= 1 && v.length <= 5,
      message: 'Kamida 1 va ko\'pi bilan 5 ta mutaxassislik kiriting'
    }
  },
  teachingStyle: {
    type: String,
    enum: ['structured', 'conversational', 'task-based', 'blended'],
    default: 'blended'
  },
})

export const Teacher = model("Teacher", TeacherSchema)
