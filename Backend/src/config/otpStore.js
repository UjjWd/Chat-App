// otpStore.js
const otpMap = new Map();


const saveOtp = (email, otp) => {
  otpMap.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
  console.log(`OTP for ${email} saved: ${otp}`);
};

const verifyOtp = (email, inputOtp) => {
  const record = otpMap.get(email);
  console.log(`Verifying OTP for ${email}: ${inputOtp}`);
  console.log(`Record: ${JSON.stringify(record)}`);
  if (!record || Date.now() > record.expiresAt || record.otp !== inputOtp) {
    return false;
  }
  otpMap.delete(email);
  return true;
};
module.exports = { saveOtp, verifyOtp };