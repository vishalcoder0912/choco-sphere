import bcrypt from "bcryptjs";
import { prisma } from "../models/prismaClient.js";
import { ApiError } from "../utils/apiError.js";
import { signToken } from "../utils/jwt.js";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export const registerUser = async ({ name, email, password }) => {
  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  if (password.trim().length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password.trim(), 10);
  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "USER",
    },
    select: publicUserSelect,
  });

  return {
    user,
    token: signToken({ userId: user.id, role: user.role }),
  };
};

export const loginUser = async ({ email, password }) => {
  if (!email?.trim() || !password?.trim()) {
    throw new ApiError(400, "Email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      ...publicUserSelect,
      password: true,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password.trim(), user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { password: _password, ...safeUser } = user;

  return {
    user: safeUser,
    token: signToken({ userId: safeUser.id, role: safeUser.role }),
  };
};
