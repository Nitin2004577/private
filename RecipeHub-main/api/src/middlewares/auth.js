import jwt from "../utils/jwt.js";

const auth = async (req, res, next) => {
  
  const cookie = req.headers.cookie;

  if (!cookie) return res.status(401).send("User not authenticated.");

  const authToken = req.cookies.authToken;
  try {
    const data = await jwt.verifyJwt(authToken);

    req.user = data;
    next();
  } catch (error) {
    res.status(401).send("User not authenticated.");
  }
};

export default auth;
