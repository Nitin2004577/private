import authService from "../services/authService.js";
import jwt from "../utils/jwt.js";
const registerUser = async (req, res) => {
  try {
    const input = req.body;

    if (!input.confirmPassword)
      return res.status(400).send("Confirm Password is required!");

    if (input.confirmPassword !== input.password)
      return res.status(400).send("Passwords do not match!");

    const registeredUser = await authService.register(input);
    const authToken = jwt.createJwt(registeredUser);

    res.cookie("authToken", authToken, { maxAge: 86400 * 1000 * 7 }); // cookie generation
    res.status(201).json(registeredUser);
  } catch (error) {
    res.status(error.statusCode || 500).send(error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const input = req.body;
    const loggedUser = await authService.login(input);
    const authToken = jwt.createJwt(loggedUser);
    
    res.cookie("authToken", authToken, { maxAge: 86400 * 1000 * 7 }); // cookie generation
    res.status(200).json(loggedUser);
  } catch (error) {
    res.status(error.statusCode || 500).send(error.message);
  }
};

export default { registerUser, loginUser };
