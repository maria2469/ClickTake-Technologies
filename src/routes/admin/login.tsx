import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { BackgroundScene } from "@/components/BackgroundScene";
import { CustomCursor } from "@/components/CustomCursor";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Sign In — ClickTake Admin Portal" },
      { name: "description", content: "Access the ClickTake Technologies administrative console." },
    ],
  }),
  component: AdminLogin,
});

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateForm = () => {
    let isValid = true;
    if (!email) {
      setEmailError("Email address is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      toast.error("Login failed", { description: error.message });
    } else {
      toast.success("Welcome back, Administrator!");
      router.navigate({ to: "/admin" });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#03000D] text-[#F0EBF8] overflow-hidden px-4">
      {/* Background glowing gradients */}
      <BackgroundScene />
      <CustomCursor />

      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-pink/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glow Border Effect wrapper */}
        <div className="absolute -inset-0.5 bg-linear-to-r from-brand-pink via-brand-magenta to-brand-blue rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        
        {/* Glassmorphism Card */}
        <div className="relative bg-[#070018]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          
          {/* Header branding */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="h-10 w-10 bg-gradient-brand flex items-center justify-center rounded-xl text-white font-display text-sm font-black shadow-lg">
                CT
              </div>
              <span className="font-display text-lg font-extrabold tracking-tight">ClickTake</span>
            </Link>
            <h2 className="text-2xl font-display font-bold tracking-tight text-white">
              Administrator Login
            </h2>
            <p className="text-xs text-[#7A6B95] mt-2">
              Enter your credentials to manage ClickTake infrastructure.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A6B95]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A6B95]" />
                <input
                  type="email"
                  placeholder="admin@clicktake.co"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  className={`w-full bg-[#0D0025]/60 border rounded-xl pl-11 pr-4 py-3 text-xs text-[#F0EBF8] placeholder-[#7A6B95]/50 transition-all duration-300 focus:outline-none ${
                    emailError
                      ? "border-rose-500/50 focus:border-rose-500"
                      : "border-white/10 focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/20"
                  }`}
                />
              </div>
              {emailError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] text-brand-pink font-medium"
                >
                  {emailError}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A6B95]">
                  Password
                </label>
                <Link
                  to="/admin/forgot-password"
                  className="text-[10px] font-bold text-brand-blue hover:text-brand-cyan transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A6B95]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  className={`w-full bg-[#0D0025]/60 border rounded-xl pl-11 pr-11 py-3 text-xs text-[#F0EBF8] placeholder-[#7A6B95]/50 transition-all duration-300 focus:outline-none ${
                    passwordError
                      ? "border-rose-500/50 focus:border-rose-500"
                      : "border-white/10 focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A6B95] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] text-brand-pink font-medium"
                >
                  {passwordError}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden rounded-xl p-0.5 font-bold transition-transform hover:scale-[1.02]"
            >
              <span className="absolute inset-0 bg-linear-to-r from-brand-pink via-brand-magenta to-brand-blue" />
              <span className="relative flex h-11 items-center justify-center rounded-[10px] bg-[#070018]/90 text-white hover:bg-transparent transition-all duration-300 text-xs">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    Verifying secure credentials...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Sign In to Console <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </span>
            </button>
          </form>

          {/* Footer redirection */}
          <div className="text-center mt-6 pt-5 border-t border-white/5">
            <span className="text-[11px] text-[#7A6B95]">Need administrator access? </span>
            <Link
              to="/admin/create-admin"
              className="text-[11px] font-bold text-brand-pink hover:text-brand-magenta transition-colors ml-1"
            >
              Register Admin
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
