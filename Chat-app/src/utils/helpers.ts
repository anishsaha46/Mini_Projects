import { compare, hash } from 'bcrypt';
import { SignJWT, jwtVerify } from 'jose';
import { z } from 'zod';
import { JWTPayload } from 'jose';

// Password hashing helpers
export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, 10);
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await compare(password, hashedPassword);
};

// JWT helpers
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);



export const generateToken = async (payload: JWTPayload): Promise<string> => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
};

export const verifyToken = async (token: string) => {
  try {
    return await jwtVerify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = loginSchema.extend({
  username: z.string().min(3),
});

// Error handling
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Date formatting
export const formatDate = (date: Date): string => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};