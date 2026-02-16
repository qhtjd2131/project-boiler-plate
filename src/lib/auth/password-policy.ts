const PASSWORD_MIN_LENGTH = 10;

export const PASSWORD_POLICY_REQUIREMENTS = [
  `At least ${PASSWORD_MIN_LENGTH} characters`,
  "At least one uppercase letter (A-Z)",
  "At least one lowercase letter (a-z)",
  "At least one number (0-9)",
  "At least one special character",
] as const;

export type PasswordPolicyResult = {
  valid: boolean;
  errors: string[];
};

export function validatePasswordPolicy(password: string): PasswordPolicyResult {
  const errors: string[] = [];

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(PASSWORD_POLICY_REQUIREMENTS[0]);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push(PASSWORD_POLICY_REQUIREMENTS[1]);
  }

  if (!/[a-z]/.test(password)) {
    errors.push(PASSWORD_POLICY_REQUIREMENTS[2]);
  }

  if (!/[0-9]/.test(password)) {
    errors.push(PASSWORD_POLICY_REQUIREMENTS[3]);
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push(PASSWORD_POLICY_REQUIREMENTS[4]);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
