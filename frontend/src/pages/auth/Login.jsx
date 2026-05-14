import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap, Mail, Lock } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../store/useAuthStore";
import AnimatedPage from "../../components/AnimatedPage";
import toast from "react-hot-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await authService.googleLogin(credentialResponse.credential);
      const token = res?.data?.token || res?.token;
      const user  = res?.data?.user  || res?.user;
      if (!token) throw new Error("No token received");
      setAuth(user, token);
      toast.success("Welcome! Signed in with Google.");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Google login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in failed. Please try again.");
  };

  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setIsPending(true);
    setLoading(true);
    try {
      const email = formData.get("email");
      const password = formData.get("password");
      const res = await authService.login({ email, password });
      const token = res?.data?.token || res?.token;
      const user  = res?.data?.user  || res?.user;
      if (!token) throw new Error("No token received");
      setAuth(user, token);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Login failed";
      toast.error(msg);
    } finally {
      setIsPending(false);
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen flex bg-background">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
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
            Welcome Back
          </h2>
          <p className="text-text-muted mb-8">
            Continue your journey to academic excellence.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  defaultValue=""
                  placeholder="name@example.com"
                  className="input-field pl-11"
                  required
                  id="login-email"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-text-primary">
                  Password
                </label>
                <span className="text-xs text-[#4A3728] cursor-pointer hover:underline">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  defaultValue=""
                  placeholder="Enter your password"
                  className="input-field pl-11 pr-12"
                  required
                  id="login-password"
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="keep-signed-in"
                className="w-4 h-4 rounded-full border-gray-300 text-[#4A3728] focus:ring-[#4A3728]"
              />
              <label
                htmlFor="keep-signed-in"
                className="text-sm text-text-muted cursor-pointer"
              >
                Keep me signed in for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
              id="login-submit"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In"
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
                or continue with
              </span>
            </div>
          </div>

          {/* Official Google Login Button - uses popup, no redirect_uri needed */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="continue_with"
              shape="rectangular"
              size="large"
              width="384"
              theme="outline"
            />
          </div>

          <p className="text-center text-text-muted mt-6 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#4A3728] font-semibold hover:underline"
            >
              Register for free
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
             Global Study Platform
          </div>
          <h2 className="text-5xl font-bold text-white font-heading mb-6 leading-tight tracking-tighter">
            Study Smarter,
            <br />
            Not Harder.
          </h2>
          <p className="text-[#A3A3A3] text-lg mb-10 leading-relaxed font-medium">
            Join thousands of students using detailed insights to master their
            exams and accelerate their careers.
          </p>
          <div className="flex gap-6 justify-center">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl px-8 py-5 border border-white/10">
              <p className="text-3xl font-bold text-white font-mono tracking-tighter">10K+</p>
              <p className="text-[#6B6B6B] text-[11px] font-bold uppercase tracking-wider mt-1">Active Students</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl px-8 py-5 border border-white/10">
              <p className="text-3xl font-bold text-white font-mono tracking-tighter">95%</p>
              <p className="text-[#6B6B6B] text-[11px] font-bold uppercase tracking-wider mt-1">Avg Pass Rate</p>
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

export default Login;
