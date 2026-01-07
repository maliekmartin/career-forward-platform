import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Password validation rules (strong password requirements)
 * - Minimum 12 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "fair" | "good" | "strong";
} {
  const errors: string[] = [];
  let score = 0;

  if (password.length < 12) {
    errors.push("Password must be at least 12 characters long");
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  } else {
    score += 1;
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  } else {
    score += 1;
  }

  // Bonus for length
  if (password.length >= 16) score += 1;

  let strength: "weak" | "fair" | "good" | "strong";
  if (score <= 2) strength = "weak";
  else if (score <= 3) strength = "fair";
  else if (score <= 4) strength = "good";
  else strength = "strong";

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}
