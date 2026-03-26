import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock, User, Smartphone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLogin() {
  const { login, user } = useAuth();
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else navigate("/confirmateur/orders");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || "خطأ في تسجيل الدخول");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b18] flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">

      {/* Animated background orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-700/20 blur-[100px] animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-700/20 blur-[90px] animate-[pulse_10s_ease-in-out_infinite_2s]" />
      <div className="absolute top-1/2 left-1/3 w-[250px] h-[250px] rounded-full bg-blue-500/10 blur-[70px] animate-[pulse_6s_ease-in-out_infinite_4s]" />

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
            className="relative inline-flex items-center justify-center mb-5"
          >
            <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-xl scale-125" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30 border border-blue-400/20">
              <span className="text-white font-black text-4xl">D</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl font-black text-white mb-1">
              Demo<span className="text-blue-400"> Store</span>
            </h1>
            <p className="text-blue-300/50 text-sm tracking-wide">لوحة الإدارة والمؤكدين</p>
          </motion.div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl shadow-blue-950/50"
        >
          {/* Card top glow line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

          <h2 className="text-xl font-black text-white mb-7 text-center tracking-tight">تسجيل الدخول</h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm mb-5 text-center"
              data-testid="login-error"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-blue-100/70 text-xs font-semibold mb-2 tracking-wide">اسم المستخدم</label>
              <div className="relative group">
                <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/50 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  className="w-full bg-white/[0.05] border border-white/[0.08] focus:border-blue-500/60 rounded-xl pr-10 pl-4 py-3 text-white placeholder-white/20 focus:outline-none transition-all focus:bg-white/[0.07] text-sm"
                  data-testid="input-login-username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-blue-100/70 text-xs font-semibold mb-2 tracking-wide">كلمة المرور</label>
              <div className="relative group">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/50 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="w-full bg-white/[0.05] border border-white/[0.08] focus:border-blue-500/60 rounded-xl pr-10 pl-10 py-3 text-white placeholder-white/20 focus:outline-none transition-all focus:bg-white/[0.07] text-sm"
                  data-testid="input-login-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400/40 hover:text-blue-300 transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="relative w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-700/40 hover:shadow-blue-600/50 flex items-center justify-center gap-2 disabled:opacity-60 mt-2 overflow-hidden transition-shadow"
              data-testid="button-login-submit"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-white/10 to-blue-500/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" />جاري الدخول...</>
              ) : (
                <><Lock className="w-4 h-4" />دخول</>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Demo credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4"
        >
          <p className="text-blue-300/60 text-xs font-bold mb-3 text-center tracking-widest uppercase">بيانات الدخول التجريبية</p>
          <div className="space-y-2">
            {[
              { role: "مدير", user: "admin", pass: "admin2026" },
              { role: "مؤكد طلبيات", user: "confirmateur1", pass: "conf2026" },
            ].map(cred => (
              <div
                key={cred.user}
                className="flex items-center justify-between bg-white/[0.04] hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 rounded-xl px-4 py-2.5 cursor-pointer transition-all group"
                onClick={() => { setUsername(cred.user); setPassword(cred.pass); }}
              >
                <div>
                  <p className="text-blue-300/40 text-[10px] mb-0.5">{cred.role}</p>
                  <p className="text-white/70 text-xs font-mono">{cred.user} / {cred.pass}</p>
                </div>
                <span className="text-blue-400 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">انقر للتعبئة ←</span>
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
