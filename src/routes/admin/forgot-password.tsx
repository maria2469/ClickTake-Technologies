import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BackgroundScene } from "@/components/BackgroundScene";
import { CustomCursor } from "@/components/CustomCursor";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/admin/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — ClickTake Admin Portal" },
      { name: "description", content: "Reset your administrator credentials." },
    ],
  }),
  component: AdminForgotPassword,
});

export function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    if (!email) {
      setEmailError("Email address is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (error) throw error;
      setIsSuccess(true);
      toast.success("Recovery instructions dispatched!", {
        description: `Reset link was sent to ${email}.`,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to send recovery email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#03000D] text-[#F0EBF8] overflow-hidden px-4">
      <BackgroundScene />
      <CustomCursor />

      {/* Decorative glows */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-brand-magenta/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Border glow wrap */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-pink via-brand-magenta to-brand-blue rounded-3xl blur opacity-25" />

        {/* Card */}
        <div className="relative bg-[#070018]/85 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl">
          
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="h-9 w-9 bg-gradient-brand flex items-center justify-center rounded-lg text-white font-display text-xs font-black shadow-lg">
                CT
              </div>
              <span className="font-display text-md font-extrabold tracking-tight">ClickTake</span>
            </Link>
            <h2 className="text-xl font-display font-bold text-white tracking-tight">
              Reset Password
            </h2>
            <p className="text-xs text-[#7A6B95] mt-1.5 leading-relaxed">
              Enter your email address and we'll dispatch a link to securely configure a new credential key.
            </p>
          </div>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-4"
            >
              <div className="h-12 w-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Email Dispatched</h4>
                <p className="text-[11px] text-[#7A6B95] leading-relaxed px-4">
                  Check your inbox at <span className="text-white font-semibold">{email}</span> and click the link to configure your password.
                </p>
              </div>

              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-pink hover:text-brand-magenta transition-colors pt-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email field */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A6B95]">
                  Admin Email
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
                    className={`w-full bg-[#0D0025]/60 border rounded-xl pl-11 pr-4 py-3 text-xs text-[#F0EBF8] placeholder-[#7A6B95]/40 transition duration-300 focus:outline-none ${
                      emailError
                        ? "border-rose-500/50 focus:border-rose-500"
                        : "border-white/10 focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/10"
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="text-[10px] text-brand-pink font-medium">{emailError}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden rounded-xl p-0.5 font-bold transition-transform hover:scale-[1.01]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-brand-pink via-brand-magenta to-brand-blue" />
                <span className="relative flex h-11 items-center justify-center rounded-[10px] bg-[#070018]/90 text-white hover:bg-transparent transition-all duration-300 text-xs">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                      Reaching SMTP server...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      Transmit Reset Link <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </span>
              </button>

              {/* Return to login link */}
              <div className="text-center pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#7A6B95] hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Return to Login
                </Link>
              </div>

            </form>
          )}

        </div>
      </motion.div>
    </div>
  );
}
