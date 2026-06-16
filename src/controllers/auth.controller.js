import * as authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.register(email, password);

  res.status(201).json({
    success: true,
    message: "Sign-up successful",
    data: { id: user.id, email: user.email },
  });
});

export const login = asyncHandler(async (req, res) => {
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
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});
