import crypto from "crypto";

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const generateOTPExpired = () => {
  return new Date(Date.now() + 5 * 60 * 1000);
};

const generateEmailToken = async () => {
  return crypto.randomBytes(32).toString("hex");
};

export { generateOTP, generateOTPExpired, generateEmailToken };
