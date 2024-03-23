import mongoose from "mongoose";
import { accountStatusType, roleAccountType } from "../ulti/types";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  phoneNumber: String,
  email: { type: String, unique: true  },
  status: { type: String, default: accountStatusType.inactive },
  otp: { type: String,default:"" },
  role: { type: String, default: roleAccountType.user },
  createdAt: { type: Number, default: Date.now },
  refreshToken: { type: String},
  isActive: { type: Boolean, default:true}
});
const UserModel = mongoose.model('user', userSchema);
export default UserModel
