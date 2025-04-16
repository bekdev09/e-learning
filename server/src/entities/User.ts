import { Document, Schema } from "mongoose";


interface IUser extends Document {
  email: string,
  password: string,
  emailVerified: boolean
  firstName: string,
  lastName: string,
  phone: string,
  phoneVerified: boolean,
  role: "student" | "teacher" | "admin",
  avatar?: string,
  dateOfBirth: Date
  status: 'active' | 'suspended' | 'pending',
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema({

})
