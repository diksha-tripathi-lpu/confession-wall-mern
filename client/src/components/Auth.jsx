import { useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import config from "../config";

function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const endpoint = isLogin ? "login" : "register";

    try {
      const res = await fetch(`${config.API_BASE_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.token) {
        sessionStorage.setItem("token", data.token);
        toast.success(`Welcome ${isLogin ? 'back' : ''}!`);
        setToken(data.token);
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (err) {
      toast.error("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="auth-card glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>{isLogin ? "Welcome Back" : "Join the Wall"}</h2>
      <p className="subtitle">
        {isLogin ? "Enter your credentials to continue." : "Create an account to start sharing safely."}
      </p>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="input-group">
            <User className="input-icon" size={18} />
            <input
              className="input-with-icon"
              type="text"
              placeholder="Full Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
        )}

        <div className="input-group">
          <Mail className="input-icon" size={18} />
          <input
            className="input-with-icon"
            type="email"
            placeholder="Email Address"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="input-group">
          <Lock className="input-icon" size={18} />
          <input
            className="input-with-icon"
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <button className="primary-btn" type="submit" disabled={isLoading}>
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              style={{ width: 20, height: 20, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%" }}
            />
          ) : (
            <>
              {isLogin ? "Sign In" : "Create Account"} <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <p className="switch-text">
        {isLogin ? "New here? " : "Already have an account? "}
        <span onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create account" : "Sign In"}
        </span>
      </p>
    </motion.div>
  );
}

export default Auth;