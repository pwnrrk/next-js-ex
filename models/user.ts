import { Schema, model, models, Types } from "mongoose";

export interface UserModel {
  _id?: Types.ObjectId;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  token?: string;
}

const userSchema = new Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
});

if (!models.User) model("User", userSchema);
const User = models.User;
export default User;
