import { Document, model, Schema } from "mongoose";

import { isStrongPassword } from "validator";
import { ITimestamps } from "./Shared";

interface IUser extends Document, ITimestamps {
  email: string,
  phone?: string,
  password: string,
  firstName: string,
  lastName?: string,
  emailVerified: boolean
  phoneVerified: boolean,
  role: "student" | "teacher" | "admin",
  avatar?: string,
  dateOfBirth?: Date
  status: 'active' | 'suspended' | 'pending',
  lastLogin: Date
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    index: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Iltimos to‘g‘ri email kiriting']
  },
  phone: {
    type: String,
    required: [true, 'Telefon raqam majburiy'],
    unique: [true, "Phone number is already in use."],
    match: [/^\+?[0-9]{9,15}$/, 'Iltimos to‘g‘ri telefon raqam kiriting'],
    index: true
  },
  password: {
    type: String,
    required: true,
    select: false,
    validate: {
      validator: function (value: string) {
        return isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        });
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid password. Password must be at least 8 characters long, include uppercase, lowercase, numbers, and symbols.`,
    },
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },

  firstName: {
    type: String,
    required: [true, 'Ism majburiy']
  },
  lastName: {
    type: String,
    required: [true, 'Familiya majburiy']
  },
  avatar: {
    type: String,
    default: 'default_avatar.png'
  },
  dateOfBirth: {
    type: Date
  },

  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    required: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'pending'],
    default: 'pending',
  }
}, {
  timestamps: true
})

UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ phone: 1 }, { unique: true })

UserSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save();
};

export const User = model<IUser>("User", UserSchema)
