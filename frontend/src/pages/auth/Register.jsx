import { useAuthStore } from '../../store/useAuthStore';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { authService } from "../../services/authService";
import { EXAM_TYPES } from "../../utils/constants";

import AnimatedPage from "../../components/AnimatedPage";
import toast from "react-hot-toast";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [examType, setExamType] = useState("");
  const navigate = useNavigate();
  

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await authService.googleLogin(credentialResponse.credential);
      /* dispatch removed */;
      toast.success("Signed in with Google! Welcome to SmartPrep.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Google sign-in failed");
    }
  };

  const handleGoogleError = () =>
    toast.error("Google sign-in failed. Please try again.");

  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      examType,
    };
    setIsPending(true);
    try {
      await authService.register(payload);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.error || "Registration failed";
      toast.error(msg);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen flex bg-background">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="flex items-center gap-3 mb-10 hover:opacity-80 transition-opacity tracking-wide"
          >
            <div className="w-10 h-10 bg-[#4A3728] rounded-xl flex items-center justify-center shadow-lg shadow-[#4A3728]/30">
              <GraduationCap size={22} className="text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-text-primary">
              SmartPrep
            </span>
          </Link>

          <h2 className="text-3xl font-bold text-text-primary font-heading mb-2">
            Create your account
          </h2>
          <p className="text-text-muted mb-8">
            Join 10,000+ students on SmartPrep today.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Full Name
              </label>
              <input
                name="name"
                placeholder="Enter your name"
                className="input-field"
                required
                id="register-name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                className="input-field"
                required
                id="register-email"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="input-field pr-12"
                  required
                  minLength={8}
                  id="register-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Exam Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {EXAM_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setExamType(type.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${examType === type.value ? "border-[#4A3728] bg-[#4A3728]/5" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <p className="font-semibold text-sm text-text-primary">
                      {type.label}
                    </p>
                    <p className="text-xs text-text-muted">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
              id="register-submit"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-400 font-medium">
                or sign up with
              </span>
            </div>
          </div>

          {/* Official Google Sign Up Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signup_with"
              shape="rectangular"
              size="large"
              width="384"
              theme="outline"
            />
          </div>

          <p className="text-center text-text-muted mt-6 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#4A3728] font-semibold hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Hero */}
      <div className="hidden lg:flex flex-1 relative flex-col items-center justify-between p-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            backgroundImage: 'url(/assets/educational_hero_bg.png)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </div>

        <div className="z-10" /> {/* Spacer for top */}
        <div className="text-center max-w-md z-10">
          <div className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-sm border border-white/10">
            Dynamic Study Planner
          </div>
          <h2 className="text-5xl font-bold text-white font-heading mb-6 leading-tight tracking-tighter">
            Study Smarter,
            <br />
            Not Harder.
          </h2>
          <p className="text-[#A3A3A3] text-lg mb-10 leading-relaxed font-medium">
            Master your exams with personalized study paths, adaptive practice
            sessions, and real-time performance tracking.
          </p>
          <div className="flex gap-6 justify-center">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl px-8 py-5 border border-white/10">
              <p className="text-3xl font-bold text-white font-mono tracking-tighter">10K+</p>
              <p className="text-[#6B6B6B] text-[11px] font-bold uppercase tracking-wider mt-1">Active Students</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl px-8 py-5 border border-white/10">
              <p className="text-3xl font-bold text-white font-mono tracking-tighter">95%</p>
              <p className="text-[#6B6B6B] text-[11px] font-bold uppercase tracking-wider mt-1">Pass Rate</p>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        ></div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Register;
