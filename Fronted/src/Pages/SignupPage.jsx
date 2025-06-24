import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import { UseAuthStore } from "../store/UseAuthStore";
import toast from "react-hot-toast";
import { AuthImagePattern } from "../components/AuthImagePattern";
import { axiosInstance } from "../utils/axios";
import { Navbar } from "../components/Navbar";

export const SignupPage = () => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  // const [otpSent, setOtpSent] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const { signup, isSigningUp, sendOtp, verifyOtp,otpSent } = UseAuthStore();

  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    console.log("Form submitted, validation passed:", success);
    if (success === true) {
      // setOtpSent(true);
      sendOtp(formData.email);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    console.log("OTP submitted:", otp);

    if (!otp) {
      return toast.error("OTP is required");
    }

    setIsVerifyingOtp(true); // Start verifying OTP
    const success = await verifyOtp(formData.email, otp);
    console.log("OTP verification success:", success);
    setIsVerifyingOtp(false); // End verifying OTP

    if (success) {
      toast.success("OTP verified successfully");
      signup(formData);
      // setOtpSent(false);
      setFormData({ name: "", email: "", password: "" });
      setOtp("");
    } else {
      toast.error("Invalid OTP");
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">
                {otpSent ? "Verify OTP" : "Create Account"}
              </h1>
              <p className="text-base-content/60">
                {otpSent
                  ? `Enter the OTP sent to ${formData.email}.

                  Check your spam folder if you don't receive it.
                  
                  `
                  
                  

                

                  : "Get started with your free account"}
              </p>
            </div>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pl-10"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 text-base-content/40" />
                    ) : (
                      <Eye className="size-5 text-base-content/40" />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {/* OTP Input */}
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                onClick={handleOtpVerification}
                className="btn btn-primary w-full"
                disabled={isVerifyingOtp}
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Verifying OTP...
                  </>
                ) : (
                  "Verify OTP & Complete Signup"
                )}
              </button>
            </div>
          )}

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
    </>
  );
};
