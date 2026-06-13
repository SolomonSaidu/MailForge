import * as authService from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.register(email, password);
    
    res.status(201).json({
      success: true,
      message: "Sign-up successful",
      data: { id: user.id, email: user.email },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: { id: user.id, email: user.email },
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};
