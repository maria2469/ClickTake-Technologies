import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Eye, EyeOff, User, Mail, Lock, ArrowRight, Check, ShieldCheck, Cpu, Database } from "lucide-react";
import { toast } from "sonner";
import { BackgroundScene } from "@/components/BackgroundScene";
import { CustomCursor } from "@/components/CustomCursor";

export const Route = createFileRoute("/admin/create-admin")({
  head: () => ({
    meta: [
      { title: "Register Administrator — ClickTake Admin Portal" },
      { name: "description", content: "Create an administrator account for ClickTake Technologies." },
    ],
  }),
  component: AdminSignup,
});

export function AdminSignup() {
  const router = useRouter();
  
  // State variables for inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Sales Support");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Error States
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");

  // Visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Interaction states for animations
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const validateForm = () => {
    let isValid = true;

    if (!fullName.trim()) {
      setNameError("Full name is required");
      isValid = false;
    } else {
      setNameError("");
    }

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
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (!termsAccepted) {
      setTermsError("You must agree to the Terms of Service");
      isValid = false;
    } else {
      setTermsError("");
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API registration call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Administrator Account Created Successfully!", {
        description: `Your access request as a [${role}] is pending primary Super Admin approval.`,
      });
      // Route to login
      router.navigate({ to: "/admin/login" });
    }, 2000);
  };

  return (
    <div className="relative min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-[#03000D] via-[#070018] to-[#0D0025] text-[#F0EBF8] overflow-hidden selection:bg-brand-pink/30 selection:text-white">
      <BackgroundScene />
      <CustomCursor />

      {/* Subtle Moving Background Gradients */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[150px] pointer-events-none"
      />

      {/* LEFT PANEL: Seamless Futuristic Branding */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex flex-col justify-between p-12 relative z-10"
      >
        {/* Top Branding Logo */}
        <Link to="/" className="flex items-center gap-3 self-start group">
          <div className="h-10 w-10 bg-gradient-brand flex items-center justify-center rounded-xl text-white font-display text-sm font-black shadow-[0_0_15px_rgba(224,25,122,0.5)] group-hover:shadow-[0_0_25px_rgba(224,25,122,0.7)] transition-all duration-300">
            CT
          </div>
          <div>
            <div className="font-display text-md font-extrabold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-brand transition-all duration-300">ClickTake</div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-[#7A6B95] font-bold">Technologies</div>
          </div>
        </Link>

        {/* Futuristic Hero Visual */}
        <div className="my-auto relative py-12 flex flex-col justify-center items-center">
          
          {/* Animated Neon Rings & Floating Particles */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-72 h-72 rounded-full border border-brand-pink/20 border-t-brand-pink/60 shadow-[inset_0_0_30px_rgba(224,25,122,0.1)]"
            />
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="w-[340px] h-[340px] rounded-full border border-brand-blue/20 border-b-brand-blue/50 border-dashed"
            />
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.05, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="w-[400px] h-[400px] rounded-full border border-brand-purple/10 border-l-brand-purple/40 shadow-[0_0_40px_rgba(123,47,190,0.1)]"
            />
          </div>
          
          {/* Central Glowing Orb */}
          <div className="relative z-10 space-y-8 max-w-sm mx-auto text-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-[#070018] to-[#0D0025] flex items-center justify-center border border-white/10 shadow-[0_0_50px_rgba(74,144,217,0.3)] group cursor-pointer"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-brand opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-md" />
              <ShieldCheck className="h-10 w-10 text-white relative z-10" />
            </motion.div>

            <div className="space-y-3 relative z-10">
              <h3 className="text-3xl font-display font-extrabold text-white tracking-tight drop-shadow-md">
                Secure Enterprise<br/>Command Center
              </h3>
              <p className="text-xs text-[#7A6B95] leading-relaxed max-w-[280px] mx-auto font-medium">
                Establish high-level administrative profiles to oversee database routing, CMS publishing, and SMTP sequencing.
              </p>
            </div>

            {/* Premium Data Tags */}
            <div className="flex flex-wrap justify-center gap-3 relative z-10 pt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <Shield className="h-3 w-3 text-brand-pink" />
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#F0EBF8]">AES-256</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <Cpu className="h-3 w-3 text-brand-purple" />
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#F0EBF8]">Edge Network</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <Database className="h-3 w-3 text-brand-blue" />
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#F0EBF8]">Encrypted Sync</span>
              </div>
            </div>

          </div>
        </div>

        <div className="text-[10px] text-[#7A6B95] font-medium tracking-wide">
          © 2026 ClickTake Technologies. System connection secured.
        </div>
      </motion.div>

      {/* RIGHT PANEL: Form Container */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-[440px] relative"
        >
          {/* Animated Form Container Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-brand-pink/30 via-brand-purple/20 to-brand-blue/30 rounded-[2rem] blur-xl opacity-50" />

          {/* Premium Form Glassmorphism Card */}
          <div className="relative bg-[#070018]/80 border border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            
            {/* Mobile Logo */}
            <div className="flex items-center justify-between lg:hidden mb-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-brand flex items-center justify-center rounded-lg text-white font-display text-xs font-black">
                  CT
                </div>
                <span className="font-display text-sm font-bold">ClickTake</span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#7A6B95]">Admin Creation</span>
            </div>

            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-2xl font-display font-bold text-white tracking-tight">
                Create Admin Account
              </h2>
              <p className="text-[11px] text-[#7A6B95] mt-1.5 leading-relaxed font-medium">
                Submit credentials for authorization. New profiles remain pending until verified.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Row 1: Full Name */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A6B95]">
                  Full Name
                </label>
                <div className="relative group">
                  <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${focusedInput === 'name' ? 'text-brand-pink' : 'text-[#7A6B95]'}`} />
                  <input
                    type="text"
                    placeholder="Zain Paracha"
                    value={fullName}
                    onFocus={() => setFocusedInput('name')}
                    onBlur={() => setFocusedInput(null)}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (nameError) setNameError("");
                    }}
                    className={`w-full bg-[#0D0025]/50 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F0EBF8] placeholder-[#7A6B95]/50 transition-all duration-300 focus:outline-none ${
                      nameError
                        ? "border-rose-500/50 focus:border-rose-500 focus:shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                        : "border-white/10 hover:border-white/20 focus:border-brand-pink focus:shadow-[0_0_15px_rgba(224,25,122,0.2)]"
                    }`}
                  />
                </div>
                {nameError && <p className="text-[10px] text-rose-400 font-semibold pl-1">{nameError}</p>}
              </div>

              {/* Row 2: Email Address */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A6B95]">
                  Corporate Email
                </label>
                <div className="relative group">
                  <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${focusedInput === 'email' ? 'text-brand-purple' : 'text-[#7A6B95]'}`} />
                  <input
                    type="email"
                    placeholder="name@clicktake.co"
                    value={email}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    className={`w-full bg-[#0D0025]/50 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F0EBF8] placeholder-[#7A6B95]/50 transition-all duration-300 focus:outline-none ${
                      emailError
                        ? "border-rose-500/50 focus:border-rose-500 focus:shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                        : "border-white/10 hover:border-white/20 focus:border-brand-purple focus:shadow-[0_0_15px_rgba(123,47,190,0.2)]"
                    }`}
                  />
                </div>
                {emailError && <p className="text-[10px] text-rose-400 font-semibold pl-1">{emailError}</p>}
              </div>

              {/* Row 3: Role Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A6B95]">
                  Access Role Level
                </label>
                <select
                  value={role}
                  onFocus={() => setFocusedInput('role')}
                  onBlur={() => setFocusedInput(null)}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#0D0025]/50 border border-white/10 hover:border-white/20 focus:border-brand-blue focus:shadow-[0_0_15px_rgba(74,144,217,0.2)] rounded-xl px-3.5 py-2.5 text-xs text-[#F0EBF8] transition-all duration-300 focus:outline-none appearance-none"
                >
                  <option value="Super Admin">Super Admin (Full Privileges)</option>
                  <option value="Editor">Content Editor (CMS Manager)</option>
                  <option value="Sales Support">Sales Support (CRM Operator)</option>
                </select>
              </div>

              {/* Row 4: Passwords Grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                
                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A6B95]">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-colors duration-300 ${focusedInput === 'pass' ? 'text-brand-pink' : 'text-[#7A6B95]'}`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onFocus={() => setFocusedInput('pass')}
                      onBlur={() => setFocusedInput(null)}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      className={`w-full bg-[#0D0025]/50 border rounded-xl pl-9 pr-8 py-2.5 text-xs text-[#F0EBF8] placeholder-[#7A6B95]/50 transition-all duration-300 focus:outline-none ${
                        passwordError
                          ? "border-rose-500/50 focus:border-rose-500 focus:shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                          : "border-white/10 hover:border-white/20 focus:border-brand-pink focus:shadow-[0_0_15px_rgba(224,25,122,0.2)]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6B95] hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  {passwordError && <p className="text-[9px] text-rose-400 font-semibold pl-1">{passwordError}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A6B95]">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-colors duration-300 ${focusedInput === 'cpass' ? 'text-brand-blue' : 'text-[#7A6B95]'}`} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onFocus={() => setFocusedInput('cpass')}
                      onBlur={() => setFocusedInput(null)}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (confirmPasswordError) setConfirmPasswordError("");
                      }}
                      className={`w-full bg-[#0D0025]/50 border rounded-xl pl-9 pr-8 py-2.5 text-xs text-[#F0EBF8] placeholder-[#7A6B95]/50 transition-all duration-300 focus:outline-none ${
                        confirmPasswordError
                          ? "border-rose-500/50 focus:border-rose-500 focus:shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                          : "border-white/10 hover:border-white/20 focus:border-brand-blue focus:shadow-[0_0_15px_rgba(74,144,217,0.2)]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6B95] hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  {confirmPasswordError && <p className="text-[9px] text-rose-400 font-semibold pl-1">{confirmPasswordError}</p>}
                </div>

              </div>

              {/* Row 5: Custom Terms Checkbox */}
              <div className="pt-2 pb-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                        if (termsError) setTermsError("");
                      }}
                      className="sr-only"
                    />
                    <div className={`h-4 w-4 rounded-[4px] border flex items-center justify-center transition-all duration-300 ${
                      termsAccepted
                        ? "bg-gradient-brand border-transparent shadow-[0_0_10px_rgba(224,25,122,0.4)]"
                        : "border-white/20 bg-[#0D0025]/80 group-hover:border-brand-purple/50 group-hover:bg-[#0D0025]"
                    }`}>
                      <AnimatePresence>
                        {termsAccepted && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Check className="h-3 w-3 text-white stroke-[3px]" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#7A6B95] leading-relaxed font-medium select-none">
                    I acknowledge that I am an authorized operative and agree to the{" "}
                    <Link to="/legal/terms" className="text-[#F0EBF8] hover:text-brand-pink transition-colors font-bold">Terms of Service</Link>{" "}
                    and{" "}
                    <Link to="/legal/privacy" className="text-[#F0EBF8] hover:text-brand-pink transition-colors font-bold">Privacy Policy</Link>.
                  </span>
                </label>
                <AnimatePresence>
                  {termsError && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] text-rose-400 font-semibold mt-1.5 pl-7"
                    >
                      {termsError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden rounded-xl p-[1px] font-bold mt-2"
              >
                <span className="absolute inset-0 bg-gradient-brand opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex h-[42px] items-center justify-center rounded-[11px] bg-gradient-to-r from-brand-pink to-brand-purple hover:from-brand-pink hover:via-brand-purple hover:to-brand-blue transition-all duration-500 text-white text-xs shadow-[0_0_20px_rgba(224,25,122,0.3)] hover:shadow-[0_0_25px_rgba(224,25,122,0.5)]">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                      Publishing account block...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 tracking-wide">
                      Register Console Profile <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
                    </span>
                  )}
                </span>
              </motion.button>

            </form>

            <div className="text-center mt-6 pt-4 border-t border-white/5">
              <span className="text-[10px] text-[#7A6B95] font-medium">Already have a profile?</span>
              <Link
                to="/admin/login"
                className="text-[10px] font-bold text-[#F0EBF8] hover:text-brand-pink transition-colors ml-1.5 underline underline-offset-2"
              >
                Sign In
              </Link>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
