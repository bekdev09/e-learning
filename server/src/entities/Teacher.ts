import { Schema, model, Document, Types } from "mongoose";
import { User } from "./User";
import { ITimestamps } from "./Shared";

interface ITeacher extends Document, ITimestamps {
  user: Types.ObjectId | typeof User;
  bio: string;
  specialties: string[];
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
  specialties: {
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
  hourlyRate: {
    type: Number,
    required: true,
    min: [5000, "Bir soatlik narx kamida 5000 so'm bo'lishi kerak"]
  },
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
