import { Schema, model, models, Types } from "mongoose";

export interface UserModel {
  _id?: Types.ObjectId;
  avatar?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  token?: string;
}

const userSchema = new Schema({
  avatar: { type: String, default: null },
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
});

if (!models.User) model("User", userSchema);
const User = models.User;
export default User;
