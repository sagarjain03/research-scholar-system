import mongoose, { Schema, model, models, Document } from "mongoose";
import { UserType } from "../types/index"; 

// Extend Mongoose Document with your UserType
type IUser = UserType & Document;

const userSchema = new Schema<IUser>(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["scholar", "admin"], default: "user" },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", userSchema);
export default User;