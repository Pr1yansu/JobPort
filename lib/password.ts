import crypto from "crypto";

export function hashPassword(password: string): string {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
}

export function comparePasswords(
  password: string,
  hashedPassword: string
): boolean {
  return hashPassword(password) === hashedPassword;
}
