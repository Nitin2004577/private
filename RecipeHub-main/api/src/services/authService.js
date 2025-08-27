import userModel from "../models/User.js";

import bcrypt from "bcryptjs";

const register = async (data) => {
  const user = await userModel.findOne({ email: data.email });

  if (user) throw { message: "User already exists!" };

  const hashedPassword = bcrypt.hashSync(data.password); // Password hashing
  const userData = await userModel.create({
    ...data,
    password: hashedPassword,
  });
  const userObj = userData.toObject();
  delete userObj.password;

  return userObj;
};

const login = async (data) => {
  const userData = await userModel.findOne({ email: data.email });

  if (!data.email || !data.password)
    throw {
      statusCode: 400,
      message: "Please fill both email and password.",
    };

  const isPasswordMatch = bcrypt.compareSync(data.password, userData.password); // Comparing hashed Password

  if (!userData || !isPasswordMatch) {
    throw {
      statusCode: 401,
      message: "Incorrect email or password!",
    };
  };

  const userObj = userData.toObject();
  delete userObj.password;

  return userObj;
};

export default { register, login };
