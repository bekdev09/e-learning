import { Schema, model, Document, Types } from "mongoose";
import { User } from "./User";
import { IGroupClassSettings, ITimestamps, TEACHING_LEVELS } from "./Shared";

interface ITeacher extends Document, ITimestamps, IGroupClassSettings {
  user: Types.ObjectId | typeof User;
  bio: string;
  specialties: {
    subject: string;
    levels: string[];
    hourlyRate: number;
    yearsOfExperience?: number;
    certification?: string; // e.g., "TESOL for English"
  }[];
  teachingStyle?: string;
  education: {
    degree: string;
    university: string;
    graduationYear: number;
  }[];
  experience: {
    position: string;
    institution: string;
    years: number;
  }[];
  certificates: string[];
  hourlyRate: number;
  trialRate?: number;
  availability: {
    timezone: string;
    schedule: {
      day: string;
      slots: string[];
    }[];
  };
  groupClasses: {
    enabled: { type: Boolean, default: false },
    classes: {
      subject: string;
      title: string;
      description: string;
      maxStudents: number;
      minStudents: number;
      price: number;
      pricingType: 'perStudent' | 'flatRate';
      discount?: {
        minStudents: number;
        percentage: number;
      };
    }[];
  };
  isProfileCompleted: boolean;
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
  specialties: [{
    subject: { type: String, required: true, enum: ['SAT', 'IELTS', 'PreSchool', 'President School', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Programming', 'Music', 'Art', 'Other'] },
    levels: { type: [String], required: true },
    hourlyRate: { type: Number, required: true },
    yearsOfExperience: Number,
    certification: String
  }],
  teachingStyle: {
    type: String,
    enum: ['structured', 'conversational', 'task-based', 'blended'],
    default: 'blended'
  },
  education: [{
    degree: { type: String, required: true },
    university: { type: String, required: true },
    graduationYear: {
      type: Number,
      min: [1950, 'Noto\'g\'ri bitirgan yil'],
      max: [new Date().getFullYear(), 'Noto\'g\'ri bitirgan yil']
    }
  }],
  experience: [{
    position: { type: String, required: true },
    institution: { type: String, required: true },
    years: {
      type: Number,
      min: 0
    }
  }],
  certificates: [{
    type: [String],
    validate: {
      validator: (value: string[]) => value.length <= 10,
      message: "sertifikatlar soni 10tadan oshmasligi kerak!"
    }
  }],
  trialRate: {
    type: Number,
    validate: {
      validator: function (this: ITeacher, value?: number) {
        return !value || value < this.hourlyRate
      },
      message: "Sinov darsi narxi asosiy dars narxidan kam bo\'lishi kerak"
    }
  },
  availability: {
    timezone: {
      type: String,
      default: "UTC+5"
    },
    schedule: {
      day: {
        type: String,
        enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        required: true
      },
      slots: [{
        type: String,
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Noto\'g\'ri vaqt formati (HH:MM)']
      }]
    }
  },
  groupClasses: {
    enabled: { type: Boolean, default: false },
    classes: [{
      subject: {
        type: String,
        required: [true, 'Subject is required'],
        index: true
      },
      title: {
        type: String,
        required: [true, 'Class title is required'],
        maxlength: [120, 'Title cannot exceed 120 characters']
      },
      description: {
        type: String,
        required: [true, 'Class description is required'],
        maxlength: [500, 'Description cannot exceed 500 characters']
      },
      maxStudents: {
        type: Number,
        default: 10,
        min: [2, 'Minimum 2 students required']
      },
      minStudents: {
        type: Number,
        default: 3,
        min: [1, 'Minimum 1 student required']
      },
      price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [5, 'Minimum price is $5']
      },
      pricingType: {
        type: String,
        enum: ['perStudent', 'flatRate'],
        default: 'perStudent'
      },
      discount: {
        minStudents: Number,
        percentage: {
          type: Number,
          min: [0, 'Discount cannot be negative'],
          max: [100, 'Discount cannot exceed 100%']
        }
      }
    }]
  },
  isProfileCompleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

TeacherSchema.virtual("avarageRating").get(function (this: ITeacher) {
  // Keyinchalik Review modeli bilan integratsiya qilinadi
  return 4.5 // Vaqtinchalik ma'lumot
})

TeacherSchema.index({ "specialties": 1 })
TeacherSchema.index({ "hourlyRate": 1 })

export const Teacher = model<ITeacher>("Teacher", TeacherSchema)
