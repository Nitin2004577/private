import jwt from "jsonwebtoken";

import config from "../config/config.js";

const createJwt = (data) => {
  const token = jwt.sign(data, config.jwtSecret, {
    expiresIn: "2d",
  });
  
  return token;
};

const verifyJwt = async (token) => {
  return await new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtSecret, (error, data) => {
        console.log("data: ", data, "error: ", error);

      if (error) return reject(error);

      return resolve(data);
    });
  });
};

export default { createJwt, verifyJwt };
